using Api.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Infrastructure.Data;

/// <summary>
/// Application database context with Identity support
/// </summary>
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Session> Sessions { get; set; } = null!;
    public DbSet<Account> Accounts { get; set; } = null!;
    public DbSet<Verification> Verifications { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure ApplicationUser to map to existing 'users' table
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("users");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Email).HasColumnName("email").IsRequired();
            entity.Property(e => e.EmailVerified).HasColumnName("email_verified").HasDefaultValue(false);
            entity.Property(e => e.Image).HasColumnName("image");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Identity specific columns
            entity.Property(e => e.NormalizedEmail).HasColumnName("normalized_email");
            entity.Property(e => e.UserName).HasColumnName("user_name");
            entity.Property(e => e.NormalizedUserName).HasColumnName("normalized_user_name");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.SecurityStamp).HasColumnName("security_stamp");
            entity.Property(e => e.ConcurrencyStamp).HasColumnName("concurrency_stamp");
            entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
            entity.Property(e => e.PhoneNumberConfirmed).HasColumnName("phone_number_confirmed");
            entity.Property(e => e.TwoFactorEnabled).HasColumnName("two_factor_enabled");
            entity.Property(e => e.LockoutEnd).HasColumnName("lockout_end");
            entity.Property(e => e.LockoutEnabled).HasColumnName("lockout_enabled");
            entity.Property(e => e.AccessFailedCount).HasColumnName("access_failed_count");
            entity.Property(e => e.EmailConfirmed).HasColumnName("email_confirmed");

            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure Session entity
        builder.Entity<Session>(entity =>
        {
            entity.ToTable("session");

            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Token).IsUnique();

            entity.HasOne(e => e.User)
                .WithMany(u => u.Sessions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Account entity
        builder.Entity<Account>(entity =>
        {
            entity.ToTable("account");

            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.User)
                .WithMany(u => u.Accounts)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Verification entity
        builder.Entity<Verification>(entity =>
        {
            entity.ToTable("verification");
            entity.HasKey(e => e.Id);
        });
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is ApplicationUser user)
            {
                user.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is Session session)
            {
                session.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is Account account)
            {
                account.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is Verification verification)
            {
                verification.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
