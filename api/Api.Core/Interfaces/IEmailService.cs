namespace Api.Core.Interfaces;

/// <summary>
/// Email service for sending transactional emails
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Send a password reset email with a reset token
    /// </summary>
    Task SendPasswordResetEmailAsync(string email, string resetToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Send an email verification email with a verification token
    /// </summary>
    Task SendEmailVerificationAsync(string email, string verificationToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Send a welcome email to a new user
    /// </summary>
    Task SendWelcomeEmailAsync(string email, string name, CancellationToken cancellationToken = default);
}
