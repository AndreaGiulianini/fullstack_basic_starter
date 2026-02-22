using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Api.Core.Constants;
using Api.Core.DTOs;
using Api.Core.Entities;
using Api.Core.Extensions;
using Api.Core.Interfaces;
using Api.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Api.Infrastructure.Services;

/// <summary>
/// Authentication service implementation
/// </summary>
public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    private const int SessionExpiryDays = 7;
    private const int ShortSessionExpiryHours = 24;

    public AuthService(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration,
        IEmailService emailService)
    {
        _context = context;
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto, CancellationToken cancellationToken = default)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser is not null)
        {
            throw new InvalidOperationException(Messages.Auth.EmailAlreadyExists);
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid().ToString(),
            Email = dto.Email,
            UserName = dto.Email,
            Name = dto.Name,
            EmailVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException(Messages.User.FailedToCreate(errors));
        }

        // Create session
        var session = await CreateSessionAsync(user, rememberMe: true, cancellationToken: cancellationToken);

        return new AuthResponseDto
        {
            User = user.ToDto(),
            Session = new SessionDto
            {
                Token = session.Token,
                ExpiresAt = session.ExpiresAt
            }
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto, string? ipAddress = null, string? userAgent = null, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email)
            ?? throw new UnauthorizedAccessException(Messages.Auth.InvalidCredentials);

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: true);

        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
                throw new UnauthorizedAccessException(Messages.Auth.AccountLocked);

            throw new UnauthorizedAccessException(Messages.Auth.InvalidCredentials);
        }

        // Create session
        var session = await CreateSessionAsync(user, dto.RememberMe, ipAddress, userAgent, cancellationToken);

        return new AuthResponseDto
        {
            User = user.ToDto(),
            Session = new SessionDto
            {
                Token = session.Token,
                ExpiresAt = session.ExpiresAt
            }
        };
    }

    public async Task<bool> LogoutAsync(string token, CancellationToken cancellationToken = default)
    {
        var session = await _context.Sessions
            .FirstOrDefaultAsync(s => s.Token == token, cancellationToken);

        if (session is null)
            return false;

        _context.Sessions.Remove(session);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<AuthResponseDto?> GetSessionAsync(string token, CancellationToken cancellationToken = default)
    {
        var session = await _context.Sessions
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Token == token && s.ExpiresAt > DateTime.UtcNow, cancellationToken);

        if (session?.User is null)
            return null;

        return new AuthResponseDto
        {
            User = session.User.ToDto(),
            Session = new SessionDto
            {
                Token = session.Token,
                ExpiresAt = session.ExpiresAt
            }
        };
    }

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordRequestDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user is null)
        {
            // Return true anyway to prevent email enumeration
            return true;
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        // Store verification token
        var verification = new Verification
        {
            Id = Guid.NewGuid().ToString(),
            Identifier = dto.Email,
            Value = token,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Verifications.Add(verification);
        await _context.SaveChangesAsync(cancellationToken);

        // Send password reset email
        await _emailService.SendPasswordResetEmailAsync(dto.Email, token, cancellationToken);

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordRequestDto dto, CancellationToken cancellationToken = default)
    {
        var verification = await _context.Verifications
            .FirstOrDefaultAsync(v => v.Value == dto.Token && v.ExpiresAt > DateTime.UtcNow, cancellationToken);

        if (verification is null)
            throw new InvalidOperationException(Messages.Auth.InvalidOrExpiredResetToken);

        var user = await _userManager.FindByEmailAsync(verification.Identifier)
            ?? throw new InvalidOperationException(Messages.User.NotFound);

        var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException(Messages.User.FailedToResetPassword(errors));
        }

        // Remove used verification token
        _context.Verifications.Remove(verification);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequestDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException(Messages.User.NotFound);

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException(Messages.User.FailedToChangePassword(errors));
        }

        return true;
    }

    public async Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        var session = await _context.Sessions
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Token == token && s.ExpiresAt > DateTime.UtcNow, cancellationToken);

        return session is not null;
    }

    private async Task<Session> CreateSessionAsync(
        ApplicationUser user,
        bool rememberMe = false,
        string? ipAddress = null,
        string? userAgent = null,
        CancellationToken cancellationToken = default)
    {
        var expiry = rememberMe
            ? DateTime.UtcNow.AddDays(SessionExpiryDays)
            : DateTime.UtcNow.AddHours(ShortSessionExpiryHours);

        var token = GenerateJwtToken(user, expiry);

        var session = new Session
        {
            Id = Guid.NewGuid().ToString(),
            Token = token,
            UserId = user.Id,
            ExpiresAt = expiry,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Sessions.Add(session);
        await _context.SaveChangesAsync(cancellationToken);

        return session;
    }

    private string GenerateJwtToken(ApplicationUser user, DateTime expiry)
    {
        var jwtSecret = _configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException(Messages.Auth.JwtSecretNotConfigured);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, user.Name ?? user.Email!)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiry,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}
