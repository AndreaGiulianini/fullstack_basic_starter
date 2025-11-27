using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Core.Entities;

/// <summary>
/// OAuth provider account entity
/// Maps to 'account' table in PostgreSQL
/// </summary>
[Table("account")]
public class Account
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("account_id")]
    public string AccountId { get; set; } = string.Empty;

    [Required]
    [Column("provider_id")]
    public string ProviderId { get; set; } = string.Empty;

    [Required]
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;

    [Column("access_token")]
    public string? AccessToken { get; set; }

    [Column("refresh_token")]
    public string? RefreshToken { get; set; }

    [Column("id_token")]
    public string? IdToken { get; set; }

    [Column("access_token_expires_at")]
    public DateTime? AccessTokenExpiresAt { get; set; }

    [Column("refresh_token_expires_at")]
    public DateTime? RefreshTokenExpiresAt { get; set; }

    [Column("scope")]
    public string? Scope { get; set; }

    [Column("password")]
    public string? Password { get; set; }

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser? User { get; set; }
}
