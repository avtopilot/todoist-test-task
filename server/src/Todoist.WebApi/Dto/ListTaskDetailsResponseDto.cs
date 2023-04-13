namespace Todoist.WebApi.Dto;

public class ListTaskDetailsResponseDto
{
    public string Name { get; init; } = null!;

    public int Priority { get; init; }

    public string Status { get; init; } = null!;
}