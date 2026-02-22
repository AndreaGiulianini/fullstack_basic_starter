namespace Api.Core.Entities;

public interface ITimestamped
{
    DateTime UpdatedAt { get; set; }
}
