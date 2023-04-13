using Todoist.Domain.Models.Task;
using Todoist.Storage.Abstractions.Repositories;
using Todoist.Storage.InMemory.Entities;
using Todoist.Storage.InMemory.Mappers;

namespace Todoist.Storage.InMemory.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly IDictionary<string, TaskDetailsEntity> _taskEntities;

    public TaskRepository()
    {
        _taskEntities = new Dictionary<string, TaskDetailsEntity>();
    }
    
    public async Task<IEnumerable<TaskDetails>> GetTasks(CancellationToken cancellationToken)
    {
        IEnumerable<TaskDetails> result = _taskEntities.Values.Select(TaskEntityMapper.ToDomain);

        return await Task.FromResult(result);
    }

    public async Task<TaskDetails?> GetTask(string taskName, CancellationToken cancellationToken)
    {
        if (_taskEntities.TryGetValue(taskName, out var task))
        {
            await Task.FromResult(TaskEntityMapper.ToDomain(task));
        }

        return null;
    }

    public async Task<bool> AddTask(TaskDetails taskDetails, CancellationToken cancellationToken)
    {
        var entity = TaskEntityMapper.FromDomain(taskDetails);

        return await Task.FromResult(_taskEntities.TryAdd(entity.Name, entity));
    }

    // TODO: return result pattern instead?
    public async Task<bool> UpdateTask(TaskDetails taskDetails, CancellationToken cancellationToken)
    {
        var entity = TaskEntityMapper.FromDomain(taskDetails);

        var existingEntity = await GetTask(taskDetails.Name, cancellationToken);

        var result = false;

        if (existingEntity is not null)
        {
            _taskEntities[taskDetails.Name] = entity;
            result = true;
        }

        return await Task.FromResult(result);
    }

    public async Task<bool> DeleteTask(string taskName, CancellationToken cancellationToken)
    {
        var existingEntity = await GetTask(taskName, cancellationToken);

        var result = false;

        if (existingEntity is not null)
        {
            _taskEntities.Remove(taskName);
            result = true;
        }

        return await Task.FromResult(result);
    }
}