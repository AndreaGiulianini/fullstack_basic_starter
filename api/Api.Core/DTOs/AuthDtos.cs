using System.ComponentModel.DataAnnotations;
using Api.Core.Validation;

namespace Api.Core.DTOs;

/// <summary>
/// Login request DTO
/// </summary>
public record LoginRequestDto
{
    [Required(ErrorMessage = ValidationConstants.Email.Required)]
    [EmailAddress(ErrorMessage = ValidationConstants.Email.Invalid)]
    [StringLength(ValidationConstants.Email.MaxLength, ErrorMessage = ValidationConstants.Email.MaxExceeded)]
    public required string Email { get; init; }

    [Required(ErrorMessage = ValidationConstants.Password.Required)]
    [StringLength(ValidationConstants.Password.MaxLength, ErrorMessage = ValidationConstants.Password.MaxExceeded)]
    public required string Password { get; init; }

    public bool RememberMe { get; init; } = false;
}

/// <summary>
/// Register request DTO
/// </summary>
public record RegisterRequestDto
{
    [Required(ErrorMessage = ValidationConstants.Email.Required)]
    [EmailAddress(ErrorMessage = ValidationConstants.Email.Invalid)]
    [StringLength(ValidationConstants.Email.MaxLength, ErrorMessage = ValidationConstants.Email.MaxExceeded)]
    public required string Email { get; init; }

    [Required(ErrorMessage = ValidationConstants.Password.Required)]
    [StringLength(ValidationConstants.Password.MaxLength, MinimumLength = ValidationConstants.Password.MinLength, ErrorMessage = ValidationConstants.Password.Range)]
    [RegularExpression(ValidationConstants.PasswordRegex, ErrorMessage = ValidationConstants.PasswordRegexError)]
    public required string Password { get; init; }

    [StringLength(ValidationConstants.Name.MaxLength, ErrorMessage = ValidationConstants.Name.MaxExceeded)]
    [RegularExpression(ValidationConstants.NameRegex, ErrorMessage = ValidationConstants.NameRegexError)]
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
    [Required(ErrorMessage = ValidationConstants.Email.Required)]
    [EmailAddress(ErrorMessage = ValidationConstants.Email.Invalid)]
    [StringLength(ValidationConstants.Email.MaxLength, ErrorMessage = ValidationConstants.Email.MaxExceeded)]
    public required string Email { get; init; }
}

/// <summary>
/// Reset password request DTO
/// </summary>
public record ResetPasswordRequestDto
{
    [Required(ErrorMessage = ValidationConstants.Token.Required)]
    [StringLength(ValidationConstants.Token.MaxLength, ErrorMessage = ValidationConstants.Token.Invalid)]
    public required string Token { get; init; }

    [Required(ErrorMessage = ValidationConstants.Password.NewRequired)]
    [StringLength(ValidationConstants.Password.MaxLength, MinimumLength = ValidationConstants.Password.MinLength, ErrorMessage = ValidationConstants.Password.Range)]
    [RegularExpression(ValidationConstants.PasswordRegex, ErrorMessage = ValidationConstants.PasswordRegexError)]
    public required string NewPassword { get; init; }
}

/// <summary>
/// Change password request DTO
/// </summary>
public record ChangePasswordRequestDto
{
    [Required(ErrorMessage = ValidationConstants.Password.CurrentRequired)]
    [StringLength(ValidationConstants.Password.MaxLength, ErrorMessage = ValidationConstants.Password.MaxExceeded)]
    public required string CurrentPassword { get; init; }

    [Required(ErrorMessage = ValidationConstants.Password.NewRequired)]
    [StringLength(ValidationConstants.Password.MaxLength, MinimumLength = ValidationConstants.Password.MinLength, ErrorMessage = ValidationConstants.Password.Range)]
    [RegularExpression(ValidationConstants.PasswordRegex, ErrorMessage = ValidationConstants.PasswordRegexError)]
    public required string NewPassword { get; init; }
}
