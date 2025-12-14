using Api.Core.DTOs;
using Api.Core.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Health check endpoints
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/healthcheck")]
[Produces("application/json")]
public class HealthCheckController : ControllerBase
{
    private readonly ICacheService _cacheService;
    private readonly ILogger<HealthCheckController> _logger;

    public HealthCheckController(ICacheService cacheService, ILogger<HealthCheckController> logger)
    {
        _cacheService = cacheService;
        _logger = logger;
    }

    /// <summary>
    /// Ping endpoint with cache connectivity test
    /// </summary>
    [HttpGet("ping")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Ping()
    {
        var cacheConnected = await _cacheService.PingAsync();

        _logger.LogInformation("Health check ping. Cache connected: {CacheConnected}", cacheConnected);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Data = new
            {
                Message = "pong",
                CacheConnected = cacheConnected,
                Timestamp = DateTime.UtcNow
            }
        });
    }
}
