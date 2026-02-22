using System.Net;
using System.Text.Json;
using Api.Core.Constants;
using Api.Core.DTOs;

namespace Api.Middleware;

/// <summary>
/// Global error handling middleware
/// </summary>
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var requestId = context.TraceIdentifier;

        _logger.LogError(exception, "Unhandled exception occurred. RequestId: {RequestId}", requestId);

        var (statusCode, errorCode) = exception switch
        {
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, ErrorCodes.Unauthorized),
            KeyNotFoundException => (HttpStatusCode.NotFound, ErrorCodes.NotFound),
            InvalidOperationException => (HttpStatusCode.BadRequest, ErrorCodes.BadRequest),
            ArgumentException => (HttpStatusCode.BadRequest, ErrorCodes.ValidationError),
            _ => (HttpStatusCode.InternalServerError, ErrorCodes.InternalError)
        };

        // In production, hide internal error details to avoid leaking sensitive info
        var message = statusCode == HttpStatusCode.InternalServerError && !_env.IsDevelopment()
            ? Messages.General.UnexpectedError
            : exception.Message;

        var response = new ApiErrorResponse
        {
            Error = new ErrorDetails
            {
                Message = message,
                Code = errorCode,
                StatusCode = (int)statusCode,
                Timestamp = DateTime.UtcNow,
                Path = context.Request.Path
            }
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
    }
}

/// <summary>
/// Extension method for adding the middleware
/// </summary>
public static class ErrorHandlingMiddlewareExtensions
{
    public static IApplicationBuilder UseErrorHandling(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ErrorHandlingMiddleware>();
    }
}
