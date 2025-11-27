using Microsoft.AspNetCore.Identity;

namespace Api.Core.Entities;

/// <summary>
/// Application user entity extending ASP.NET Core Identity
/// Maps to 'users' table in PostgreSQL
/// </summary>
public class ApplicationUser : IdentityUser
{
    public string? Name { get; set; }

    public bool EmailVerified { get; set; } = false;

    public string? Image { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Session> Sessions { get; set; } = new List<Session>();
    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
