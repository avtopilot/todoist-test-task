using Todoist.Domain.Models.Task;
using Todoist.Storage.Abstractions.Repositories;

namespace Todoist.Storage.InMemory.Repositories;

public class TaskRepository : ITaskRepository
{
    public Task<IReadOnlyCollection<TaskDetails>> GetTasks(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<bool> AddTask(TaskDetails taskDetails, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateTask(TaskDetails taskDetails, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteTask(TaskDetails taskDetails, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}