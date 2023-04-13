namespace Todoist.Domain.Models.Task;

public record TaskDetails
{
    public string Name { get; init; } = null!;

    public int Priority { get; init; }

    public TaskStatus Status { get; init; }
    
    public DateTime UpdatedAt { get; init; }
}