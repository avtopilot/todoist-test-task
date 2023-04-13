namespace Todoist.Domain.Models.Task;

public enum TaskStatus
{
    /// <summary>
    /// Task is not started yet.
    /// </summary>
    NotStarted = 0,

    /// <summary>
    /// Task is in progress, not completed yet.
    /// </summary>
    InProgress = 1,
    
    /// <summary>
    /// Task was completed.
    /// </summary>
    Completed = 2
}