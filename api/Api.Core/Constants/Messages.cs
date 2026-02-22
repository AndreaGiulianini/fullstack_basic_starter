namespace Api.Core.Constants;

/// <summary>
/// Centralized response and error messages organized by domain
/// </summary>
public static class Messages
{
    public static class Auth
    {
        public const string RegisterSuccess = "User registered successfully";
        public const string LogoutSuccess = "Logged out successfully";
        public const string NoTokenProvided = "No token provided";
        public const string InvalidOrExpiredSession = "Invalid or expired session";
        public const string ForgotPasswordSuccess = "If an account with that email exists, a password reset link has been sent";
        public const string PasswordResetSuccess = "Password reset successfully";
        public const string PasswordChangeSuccess = "Password changed successfully";
        public const string UserNotAuthenticated = "User not authenticated";
        public const string EmailAlreadyExists = "A user with this email already exists";
        public const string InvalidCredentials = "Invalid email or password";
        public const string AccountLocked = "Account is locked. Please try again later.";
        public const string InvalidOrExpiredResetToken = "Invalid or expired reset token";
        public const string JwtSecretNotConfigured = "JWT secret not configured";
    }

    public static class User
    {
        public const string CreatedSuccess = "User created successfully";
        public const string UpdatedSuccess = "User updated successfully";
        public const string DeletedSuccess = "User deleted successfully";
        public const string NotFound = "User not found";

        public static string NotFoundById(string id) => $"User with id '{id}' not found";
        public static string FailedToCreate(string errors) => $"Failed to create user: {errors}";
        public static string FailedToResetPassword(string errors) => $"Failed to reset password: {errors}";
        public static string FailedToChangePassword(string errors) => $"Failed to change password: {errors}";
    }

    public static class General
    {
        public const string UnexpectedError = "An unexpected error occurred";
        public const string Pong = "pong";
    }
}
