using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using Todoist.Storage.Abstractions.Repositories;
using Todoist.WebApi.Dto;

namespace Todoist.WebApi.Controllers;

[ApiController]
[ApiVersion("1")]
[Route("v{version:apiVersion}")]
[Produces(MediaTypeNames.Application.Json)]
public class TaskController : Controller
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
}