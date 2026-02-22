namespace Api.Core.Validation;

public static class ValidationConstants
{
    public const string PasswordRegex = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$";
    public const string PasswordRegexError = "Password must contain at least one uppercase letter, one lowercase letter, and one number";

    public const string NameRegex = @"^[a-zA-Z\s\-'\.]+$";
    public const string NameRegexError = "Name can only contain letters, spaces, hyphens, apostrophes, and periods";

    public static class Email
    {
        public const string Required = "Email is required";
        public const string Invalid = "Invalid email format";
        public const string MaxExceeded = "Email cannot exceed 255 characters";
        public const int MaxLength = 255;
    }

    public static class Password
    {
        public const string Required = "Password is required";
        public const string Range = "Password must be between 8 and 100 characters";
        public const string MaxExceeded = "Password cannot exceed 100 characters";
        public const string CurrentRequired = "Current password is required";
        public const string NewRequired = "New password is required";
        public const int MinLength = 8;
        public const int MaxLength = 100;
    }

    public static class Name
    {
        public const string MaxExceeded = "Name cannot exceed 100 characters";
        public const int MaxLength = 100;
    }

    public static class Token
    {
        public const string Required = "Token is required";
        public const string Invalid = "Token is invalid";
        public const int MaxLength = 500;
    }

    public static class Image
    {
        public const string InvalidUrl = "Invalid image URL format";
        public const string MaxExceeded = "Image URL cannot exceed 500 characters";
        public const int MaxLength = 500;
    }
}
