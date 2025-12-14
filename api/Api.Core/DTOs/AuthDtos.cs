using System.ComponentModel.DataAnnotations;

namespace Api.Core.DTOs;

/// <summary>
/// Login request DTO
/// </summary>
public record LoginRequestDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
    public required string Email { get; init; }

    [Required(ErrorMessage = "Password is required")]
    [StringLength(100, ErrorMessage = "Password cannot exceed 100 characters")]
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
    [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
    public required string Email { get; init; }

    [Required(ErrorMessage = "Password is required")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one number")]
    public required string Password { get; init; }

    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    [RegularExpression(@"^[a-zA-Z\s\-'\.]+$",
        ErrorMessage = "Name can only contain letters, spaces, hyphens, apostrophes, and periods")]
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
    [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
    public required string Email { get; init; }
}

/// <summary>
/// Reset password request DTO
/// </summary>
public record ResetPasswordRequestDto
{
    [Required(ErrorMessage = "Token is required")]
    [StringLength(500, ErrorMessage = "Token is invalid")]
    public required string Token { get; init; }

    [Required(ErrorMessage = "New password is required")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one number")]
    public required string NewPassword { get; init; }
}

/// <summary>
/// Change password request DTO
/// </summary>
public record ChangePasswordRequestDto
{
    [Required(ErrorMessage = "Current password is required")]
    [StringLength(100, ErrorMessage = "Password cannot exceed 100 characters")]
    public required string CurrentPassword { get; init; }

    [Required(ErrorMessage = "New password is required")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one number")]
    public required string NewPassword { get; init; }
}
