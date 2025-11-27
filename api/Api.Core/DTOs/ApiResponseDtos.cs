namespace Api.Core.DTOs;

/// <summary>
/// Standard API success response wrapper
/// </summary>
public record ApiResponse<T>
{
    public bool Success { get; init; } = true;
    public T? Data { get; init; }
    public string? Message { get; init; }
}

/// <summary>
/// Standard API error response
/// </summary>
public record ApiErrorResponse
{
    public bool Success { get; init; } = false;
    public required ErrorDetails Error { get; init; }
}

/// <summary>
/// Error details
/// </summary>
public record ErrorDetails
{
    public required string Message { get; init; }
    public required string Code { get; init; }
    public int StatusCode { get; init; }
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
    public string? Path { get; init; }
    public IEnumerable<ValidationError>? Details { get; init; }
}

/// <summary>
/// Validation error detail
/// </summary>
public record ValidationError
{
    public required string Field { get; init; }
    public required string Message { get; init; }
    public string? Code { get; init; }
}

/// <summary>
/// Paginated response wrapper
/// </summary>
public record PaginatedResponse<T>
{
    public bool Success { get; init; } = true;
    public required IEnumerable<T> Data { get; init; }
    public required PaginationMeta Pagination { get; init; }
}

/// <summary>
/// Pagination metadata
/// </summary>
public record PaginationMeta
{
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalItems { get; init; }
    public int TotalPages { get; init; }
    public bool HasNext { get; init; }
    public bool HasPrevious { get; init; }
}
