using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Core.Entities;

/// <summary>
/// Email/phone verification code entity
/// Maps to 'verification' table in PostgreSQL
/// </summary>
[Table("verification")]
public class Verification
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("identifier")]
    public string Identifier { get; set; } = string.Empty;

    [Required]
    [Column("value")]
    public string Value { get; set; } = string.Empty;

    [Required]
    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
}
