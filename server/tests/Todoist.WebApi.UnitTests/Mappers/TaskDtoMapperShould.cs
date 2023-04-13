using Todoist.Domain.Models.Task;
using Todoist.WebApi.Dto;
using Todoist.WebApi.Mappers;
using Xunit;
using TaskStatus = Todoist.Domain.Models.Task.TaskStatus;

namespace Todoist.WebApi.UnitTests.Mappers;

public class TaskDtoMapperShould
{
    [Fact]
    public void ConvertTaskDtoToDomain()
    {
        //arrange
        var taskName = "task name";
        var dto = new TaskRequestDto
        {
            Priority = 13,
            Status = TaskStatus.NotStarted
        };

        var expectedDomain = new TaskDetails
        {
            Name = "task name",
            Priority = 13,
            Status = TaskStatus.NotStarted
        };

        // act
        var domain = TaskDtoMapper.ToDomain(taskName, dto);

        // assert
        // date is created at the mapping time
        Assert.Equal(expectedDomain with {UpdatedAt = domain.UpdatedAt}, domain);
    }
}
