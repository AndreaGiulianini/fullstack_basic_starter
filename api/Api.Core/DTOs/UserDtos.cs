using System.ComponentModel.DataAnnotations;
using Api.Core.Validation;

namespace Api.Core.DTOs;

/// <summary>
/// Safe user response DTO (excludes sensitive data)
/// </summary>
public record UserDto
{
    public required string Id { get; init; }
    public required string Email { get; init; }
    public string? Name { get; init; }
    public string? Image { get; init; }
    public bool EmailVerified { get; init; }
    public DateTime CreatedAt { get; init; }
}

/// <summary>
/// User creation request DTO
/// </summary>
public record CreateUserDto
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
/// User update request DTO
/// </summary>
public record UpdateUserDto
{
    [StringLength(ValidationConstants.Name.MaxLength, ErrorMessage = ValidationConstants.Name.MaxExceeded)]
    [RegularExpression(ValidationConstants.NameRegex, ErrorMessage = ValidationConstants.NameRegexError)]
    public string? Name { get; init; }

    [EmailAddress(ErrorMessage = ValidationConstants.Email.Invalid)]
    [StringLength(ValidationConstants.Email.MaxLength, ErrorMessage = ValidationConstants.Email.MaxExceeded)]
    public string? Email { get; init; }

    [Url(ErrorMessage = ValidationConstants.Image.InvalidUrl)]
    [StringLength(ValidationConstants.Image.MaxLength, ErrorMessage = ValidationConstants.Image.MaxExceeded)]
    public string? Image { get; init; }
}
