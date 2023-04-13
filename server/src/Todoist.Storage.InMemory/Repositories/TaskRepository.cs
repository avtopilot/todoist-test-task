using Todoist.Domain.Models.Task;
using Todoist.Storage.Abstractions.Repositories;
using Todoist.Storage.InMemory.Entities;
using Todoist.Storage.InMemory.Mappers;

namespace Todoist.Storage.InMemory.Repositories;

public class TaskRepository : ITaskRepository
{
    private ICollection<TaskDetailsEntity> _taskEntities;

    public TaskRepository()
    {
        _taskEntities = new List<TaskDetailsEntity>();
    }
    
    public async Task<IReadOnlyCollection<TaskDetails>> GetTasks(CancellationToken cancellationToken)
    {
        var result = _taskEntities.Select(TaskEntityMapper.ToDomain);

        return (IReadOnlyCollection<TaskDetails>)await Task.FromResult(result);
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