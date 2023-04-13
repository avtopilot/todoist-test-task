using Todoist.Domain.Models.Task;

namespace Todoist.Storage.Abstractions.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<TaskDetails>> GetTasks(CancellationToken cancellationToken);
    Task<TaskDetails?> GetTask(string taskName, CancellationToken cancellationToken);
    Task<bool> AddTask(TaskDetails taskDetails, CancellationToken cancellationToken);
    Task<bool> UpdateTask(TaskDetails taskDetails, CancellationToken cancellationToken);
    Task<bool> DeleteTask(string taskName, CancellationToken cancellationToken);
}