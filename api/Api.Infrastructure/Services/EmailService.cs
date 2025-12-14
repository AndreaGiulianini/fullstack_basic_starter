using Api.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Api.Infrastructure.Services;

/// <summary>
/// Email service implementation
/// TODO: Implement with your preferred email provider (SendGrid, AWS SES, SMTP, etc.)
/// </summary>
public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendPasswordResetEmailAsync(string email, string resetToken, CancellationToken cancellationToken = default)
    {
        var resetUrl = $"{_configuration["App:FrontendUrl"]}/reset-password?token={resetToken}";

        _logger.LogInformation("Password reset requested for {Email}. Reset URL: {ResetUrl}", email, resetUrl);

        // TODO: Implement email sending logic
        // Example with SendGrid:
        // var client = new SendGridClient(_configuration["SendGrid:ApiKey"]);
        // var msg = new SendGridMessage
        // {
        //     From = new EmailAddress(_configuration["Email:FromAddress"], _configuration["Email:FromName"]),
        //     Subject = "Password Reset Request",
        //     PlainTextContent = $"Click here to reset your password: {resetUrl}",
        //     HtmlContent = $"<p>Click <a href=\"{resetUrl}\">here</a> to reset your password.</p>"
        // };
        // msg.AddTo(new EmailAddress(email));
        // await client.SendEmailAsync(msg, cancellationToken);

        await Task.CompletedTask;
    }

    public async Task SendEmailVerificationAsync(string email, string verificationToken, CancellationToken cancellationToken = default)
    {
        var verificationUrl = $"{_configuration["App:FrontendUrl"]}/verify-email?token={verificationToken}";

        _logger.LogInformation("Email verification requested for {Email}. Verification URL: {VerificationUrl}", email, verificationUrl);

        // TODO: Implement email sending logic
        await Task.CompletedTask;
    }

    public async Task SendWelcomeEmailAsync(string email, string name, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Welcome email requested for {Email} (Name: {Name})", email, name);

        // TODO: Implement email sending logic
        await Task.CompletedTask;
    }
}
