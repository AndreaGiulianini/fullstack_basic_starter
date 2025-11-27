namespace Api.Core.DTOs;

/// <summary>
/// Login request DTO
/// </summary>
public record LoginRequestDto
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    public bool RememberMe { get; init; } = false;
}

/// <summary>
/// Register request DTO
/// </summary>
public record RegisterRequestDto
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    public string? Name { get; init; }
}

/// <summary>
/// Authentication response DTO
/// </summary>
public record AuthResponseDto
{
    public required UserDto User { get; init; }
    public required SessionDto Session { get; init; }
}

/// <summary>
/// Session DTO
/// </summary>
public record SessionDto
{
    public required string Token { get; init; }
    public DateTime ExpiresAt { get; init; }
}

/// <summary>
/// Forgot password request DTO
/// </summary>
public record ForgotPasswordRequestDto
{
    public required string Email { get; init; }
}

/// <summary>
/// Reset password request DTO
/// </summary>
public record ResetPasswordRequestDto
{
    public required string Token { get; init; }
    public required string NewPassword { get; init; }
}

/// <summary>
/// Change password request DTO
/// </summary>
public record ChangePasswordRequestDto
{
    public required string CurrentPassword { get; init; }
    public required string NewPassword { get; init; }
}
