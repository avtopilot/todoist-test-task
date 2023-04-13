using System.ComponentModel.DataAnnotations;
using TaskStatus = Todoist.Domain.Models.Task.TaskStatus;

namespace Todoist.WebApi.Dto;

public class TaskRequestDto
{
    [Required]
    [Range(0, 100, ErrorMessage = @"The field {0} must be in the range of {1} - {2}.")]
    public byte Priority { get; init; }

    [Required]
    [EnumDataType(typeof(TaskStatus))]
    public TaskStatus Status { get; init; }
}
