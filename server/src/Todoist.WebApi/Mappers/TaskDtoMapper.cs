using Todoist.Domain.Models.Task;
using Todoist.WebApi.Dto;

namespace Todoist.WebApi.Mappers;

internal static class TaskDtoMapper
{
    public static TaskDetails ToDomain(string taskName, TaskRequestDto dto) => new TaskDetails
    {
        Name = taskName,
        Priority = dto.Priority,
        Status = dto.Status
    };
}
