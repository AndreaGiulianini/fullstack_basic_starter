using Api.Core.DTOs;

namespace Api.Core.Interfaces;

/// <summary>
/// Authentication service interface
/// </summary>
public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto dto, string? ipAddress = null, string? userAgent = null, CancellationToken cancellationToken = default);
    Task<bool> LogoutAsync(string token, CancellationToken cancellationToken = default);
    Task<AuthResponseDto?> GetSessionAsync(string token, CancellationToken cancellationToken = default);
    Task<bool> ForgotPasswordAsync(ForgotPasswordRequestDto dto, CancellationToken cancellationToken = default);
    Task<bool> ResetPasswordAsync(ResetPasswordRequestDto dto, CancellationToken cancellationToken = default);
    Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequestDto dto, CancellationToken cancellationToken = default);
    Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);
}
