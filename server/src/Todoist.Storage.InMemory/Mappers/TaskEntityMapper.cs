using Todoist.Domain.Models.Task;
using Todoist.Storage.InMemory.Entities;
using TaskStatus = Todoist.Domain.Models.Task.TaskStatus;

namespace Todoist.Storage.InMemory.Mappers;

internal static class TaskEntityMapper
{
    public static TaskDetails ToDomain(TaskDetailsEntity entity) =>
        new TaskDetails
        {
            Name = entity.Name,
            Priority = entity.Priority,
            Status = (TaskStatus)Enum.ToObject(typeof(TaskStatus), entity.Status),
            UpdatedAt = entity.UpdatedAt
        };
}