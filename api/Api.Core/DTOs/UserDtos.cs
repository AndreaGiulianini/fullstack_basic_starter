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
    public required string Email { get; init; }
    public required string Password { get; init; }
    public string? Name { get; init; }
}

/// <summary>
/// User update request DTO
/// </summary>
public record UpdateUserDto
{
    public string? Name { get; init; }
    public string? Email { get; init; }
    public string? Image { get; init; }
}
