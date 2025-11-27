using Api.Core.DTOs;
using Api.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// User management endpoints
/// </summary>
[ApiController]
[Route("api/users")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string id, CancellationToken cancellationToken)
    {
        var user = await _userService.GetByIdAsync(id, cancellationToken);

        if (user is null)
        {
            return NotFound(new ApiErrorResponse
            {
                Error = new ErrorDetails
                {
                    Message = $"User with id '{id}' not found",
                    Code = "NOT_FOUND",
                    StatusCode = 404
                }
            });
        }

        return Ok(new ApiResponse<UserDto>
        {
            Success = true,
            Data = user
        });
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateUserDto request, CancellationToken cancellationToken)
    {
        var user = await _userService.CreateAsync(request, cancellationToken);

        _logger.LogInformation("User created: {Email}", request.Email);

        return StatusCode(StatusCodes.Status201Created, new ApiResponse<UserDto>
        {
            Success = true,
            Data = user,
            Message = "User created successfully"
        });
    }

    /// <summary>
    /// Update user by ID
    /// </summary>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto request, CancellationToken cancellationToken)
    {
        var user = await _userService.UpdateAsync(id, request, cancellationToken);

        return Ok(new ApiResponse<UserDto>
        {
            Success = true,
            Data = user,
            Message = "User updated successfully"
        });
    }

    /// <summary>
    /// Delete user by ID
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        var deleted = await _userService.DeleteAsync(id, cancellationToken);

        if (!deleted)
        {
            return NotFound(new ApiErrorResponse
            {
                Error = new ErrorDetails
                {
                    Message = $"User with id '{id}' not found",
                    Code = "NOT_FOUND",
                    StatusCode = 404
                }
            });
        }

        _logger.LogInformation("User deleted: {Id}", id);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "User deleted successfully"
        });
    }

    /// <summary>
    /// Get all users with pagination
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(PaginatedResponse<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        var result = await _userService.GetAllAsync(page, pageSize, cancellationToken);
        return Ok(result);
    }
}
