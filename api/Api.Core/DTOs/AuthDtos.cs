using System.ComponentModel.DataAnnotations;

namespace Api.Core.DTOs;

/// <summary>
/// Login request DTO
/// </summary>
public record LoginRequestDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public required string Email { get; init; }

    [Required(ErrorMessage = "Password is required")]
    public required string Password { get; init; }

    public bool RememberMe { get; init; } = false;
}

/// <summary>
/// Register request DTO
/// </summary>
public record RegisterRequestDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public required string Email { get; init; }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    public required string Password { get; init; }

    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
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
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public required string Email { get; init; }
}

/// <summary>
/// Reset password request DTO
/// </summary>
public record ResetPasswordRequestDto
{
    [Required(ErrorMessage = "Token is required")]
    public required string Token { get; init; }

    [Required(ErrorMessage = "New password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    public required string NewPassword { get; init; }
}

/// <summary>
/// Change password request DTO
/// </summary>
public record ChangePasswordRequestDto
{
    [Required(ErrorMessage = "Current password is required")]
    public required string CurrentPassword { get; init; }

    [Required(ErrorMessage = "New password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    public required string NewPassword { get; init; }
}
