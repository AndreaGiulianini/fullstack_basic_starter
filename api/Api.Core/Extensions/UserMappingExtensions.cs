using Api.Core.DTOs;
using Api.Core.Entities;

namespace Api.Core.Extensions;

public static class UserMappingExtensions
{
    public static UserDto ToDto(this ApplicationUser user) => new()
    {
        Id = user.Id,
        Email = user.Email!,
        Name = user.Name,
        Image = user.Image,
        EmailVerified = user.EmailVerified,
        CreatedAt = user.CreatedAt
    };
}
