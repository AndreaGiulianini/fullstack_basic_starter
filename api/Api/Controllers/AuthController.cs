using Api.Core.DTOs;
using Api.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

/// <summary>
/// Authentication endpoints
/// </summary>
[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user with email and password
    /// </summary>
    [HttpPost("sign-up/email")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _authService.RegisterAsync(request, cancellationToken);

        _logger.LogInformation("User registered: {Email}", request.Email);

        return StatusCode(StatusCodes.Status201Created, new ApiResponse<AuthResponseDto>
        {
            Success = true,
            Data = result,
            Message = "User registered successfully"
        });
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("sign-in/email")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var result = await _authService.LoginAsync(request, ipAddress, userAgent, cancellationToken);

        _logger.LogInformation("User logged in: {Email}", request.Email);

        return Ok(new ApiResponse<AuthResponseDto>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Get current session information
    /// </summary>
    [HttpGet("get-session")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetSession(CancellationToken cancellationToken)
    {
        var token = GetTokenFromHeader();

        if (string.IsNullOrEmpty(token))
            return Unauthorized(new ApiErrorResponse
            {
                Error = new ErrorDetails
                {
                    Message = "No token provided",
                    Code = "UNAUTHORIZED",
                    StatusCode = 401
                }
            });

        var result = await _authService.GetSessionAsync(token, cancellationToken);

        if (result is null)
            return Unauthorized(new ApiErrorResponse
            {
                Error = new ErrorDetails
                {
                    Message = "Invalid or expired session",
                    Code = "UNAUTHORIZED",
                    StatusCode = 401
                }
            });

        return Ok(new ApiResponse<AuthResponseDto>
        {
            Success = true,
            Data = result
        });
    }

    /// <summary>
    /// Logout and invalidate session
    /// </summary>
    [HttpPost("sign-out")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var token = GetTokenFromHeader();

        if (!string.IsNullOrEmpty(token))
        {
            await _authService.LogoutAsync(token, cancellationToken);
            _logger.LogInformation("User logged out");
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Logged out successfully"
        });
    }

    /// <summary>
    /// Request password reset email
    /// </summary>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request, CancellationToken cancellationToken)
    {
        await _authService.ForgotPasswordAsync(request, cancellationToken);

        // Always return success to prevent email enumeration
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "If an account with that email exists, a password reset link has been sent"
        });
    }

    /// <summary>
    /// Reset password with token
    /// </summary>
    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request, CancellationToken cancellationToken)
    {
        await _authService.ResetPasswordAsync(request, cancellationToken);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Password reset successfully"
        });
    }

    /// <summary>
    /// Change password for authenticated user
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User not authenticated");

        await _authService.ChangePasswordAsync(userId, request, cancellationToken);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Password changed successfully"
        });
    }

    private string? GetTokenFromHeader()
    {
        var authHeader = Request.Headers.Authorization.ToString();

        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return null;

        return authHeader["Bearer ".Length..];
    }
}
