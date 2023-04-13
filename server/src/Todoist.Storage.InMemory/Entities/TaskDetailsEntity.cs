namespace Todoist.Storage.InMemory.Entities;

internal record TaskDetailsEntity
{
    public string Name { get; init; } = null!;
    public byte Priority { get; init; }
    public byte Status { get; init; }
    public DateTime UpdatedAt { get; init; }
}