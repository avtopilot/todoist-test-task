using System.ComponentModel.DataAnnotations;
using TaskStatus = Todoist.Domain.Models.Task.TaskStatus;

namespace Todoist.WebApi.Dto;

public class TaskRequestDto
{
    [Required]
    [Range(0, 100)]
    public byte Priority { get; init; }

    [Required]
    [EnumDataType(typeof(TaskStatus))]
    public TaskStatus Status { get; init; }
}
