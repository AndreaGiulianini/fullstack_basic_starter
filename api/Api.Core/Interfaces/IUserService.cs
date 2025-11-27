using Api.Core.DTOs;

namespace Api.Core.Interfaces;

/// <summary>
/// User service interface for CRUD operations
/// </summary>
public interface IUserService
{
    Task<UserDto?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<UserDto?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<UserDto> CreateAsync(CreateUserDto dto, CancellationToken cancellationToken = default);
    Task<UserDto> UpdateAsync(string id, UpdateUserDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
    Task<PaginatedResponse<UserDto>> GetAllAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string id, CancellationToken cancellationToken = default);
}
