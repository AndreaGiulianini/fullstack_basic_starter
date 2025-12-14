using System.ComponentModel.DataAnnotations;

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
/// User update request DTO
/// </summary>
public record UpdateUserDto
{
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    [RegularExpression(@"^[a-zA-Z\s\-'\.]+$",
        ErrorMessage = "Name can only contain letters, spaces, hyphens, apostrophes, and periods")]
    public string? Name { get; init; }

    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
    public string? Email { get; init; }

    [Url(ErrorMessage = "Invalid image URL format")]
    [StringLength(500, ErrorMessage = "Image URL cannot exceed 500 characters")]
    public string? Image { get; init; }
}
