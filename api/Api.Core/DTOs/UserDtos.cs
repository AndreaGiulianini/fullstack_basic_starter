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
    public required string Email { get; init; }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    public required string Password { get; init; }

    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string? Name { get; init; }
}

/// <summary>
/// User update request DTO
/// </summary>
public record UpdateUserDto
{
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string? Name { get; init; }

    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; init; }

    [Url(ErrorMessage = "Invalid image URL format")]
    [StringLength(500, ErrorMessage = "Image URL cannot exceed 500 characters")]
    public string? Image { get; init; }
}
