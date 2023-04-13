using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Todoist.Storage.Abstractions.Repositories;
using Todoist.WebApi.Dto;
using Todoist.WebApi.Mappers;

namespace Todoist.WebApi.Controllers;

[ApiController]
[ApiVersion("1")]
[Route("v{version:apiVersion}")]
[Produces(MediaTypeNames.Application.Json)]
public class TaskController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;
    
    public TaskController(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }
    
    [HttpGet("tasks")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ListTasks()
    {
        var tasks = await _taskRepository.GetTasks(HttpContext.RequestAborted);

        var result = tasks.Select(task => new ListTaskDetailsResponseDto
        {
            Name = task.Name,
            Priority = task.Priority,
            Status = Enum.GetName(task.Status) ?? "Unknown"
        });

        return Ok(result);
    }

    [HttpGet("task/{taskName:required}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTask(string taskName)
    {
        var task = await _taskRepository.GetTask(taskName, HttpContext.RequestAborted);

        if (task is null)
        {
            return NotFound();
        }

        var result = new ListTaskDetailsResponseDto
        {
            Name = task.Name,
            Priority = task.Priority,
            Status = Enum.GetName(task.Status) ?? "Unknown"
        };

        return Ok(result);
    }

    [HttpPost("task/{taskName:required}")]
    // [DecodeParam(ParamName = "taskName")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AddTask(
        string taskName,
        [FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Disallow)]
        TaskRequestDto taskDto)
    {
        var existingTask = await _taskRepository.GetTask(taskName, HttpContext.RequestAborted);

        if (existingTask is not null)
        {
            return Conflict("Task with this name already exists");
        }

        var taskDomain = TaskDtoMapper.ToDomain(taskName, taskDto);

        var result = await _taskRepository.AddTask(taskDomain, HttpContext.RequestAborted);

        return result ? CreatedAtAction(nameof(AddTask), null) : Conflict();
    }
    
    [HttpPut("task/{taskName:required}")]
    // [DecodeParam(ParamName = "taskName")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateTask(
        string taskName,
        [FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Disallow)]
        TaskRequestDto taskDto)
    {
        var existingTask = await _taskRepository.GetTask(taskName, HttpContext.RequestAborted);

        if (existingTask is null)
        {
            return NotFound();
        }

        var taskDomain = TaskDtoMapper.ToDomain(taskName, taskDto);

        var result = await _taskRepository.UpdateTask(taskDomain, HttpContext.RequestAborted);

        return result ? NoContent() : NotFound();
    }

    [HttpDelete("task/{taskName:required}")]
    // [DecodeParam(ParamName = "taskName")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTask(string taskName)
    {
        var existingTask = await _taskRepository.GetTask(taskName, HttpContext.RequestAborted);

        if (existingTask is null)
        {
            return NotFound();
        }

        var result = await _taskRepository.DeleteTask(taskName, HttpContext.RequestAborted);

        return result ? NoContent() : NotFound();
    }
}