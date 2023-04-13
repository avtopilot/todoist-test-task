using Todoist.Domain.Models.Task;

namespace Todoist.Storage.Abstractions.Repositories;

public interface ITaskRepository
{
    Task<IReadOnlyCollection<TaskDetails>> GetTasks(CancellationToken cancellationToken);
    Task<bool> AddTask(TaskDetails taskDetails, CancellationToken cancellationToken);
    Task<bool> UpdateTask(TaskDetails taskDetails, CancellationToken cancellationToken);
    Task<bool> DeleteTask(TaskDetails taskDetails, CancellationToken cancellationToken);
}