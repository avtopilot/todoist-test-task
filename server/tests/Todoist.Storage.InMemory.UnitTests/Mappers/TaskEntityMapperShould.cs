using Todoist.Domain.Models.Task;
using Todoist.Storage.InMemory.Entities;
using Todoist.Storage.InMemory.Mappers;
using Xunit;
using TaskStatus = Todoist.Domain.Models.Task.TaskStatus;

namespace Todoist.Storage.InMemory.UnitTests.Mappers;

public class TaskEntityMapperShould
{
    [Fact]
    public void ConvertDomainToEntity()
    {
        //arrange
        var timeNow = DateTime.UtcNow;
        var domain = new TaskDetails
        {
            Name = "task name",
            Priority = 13,
            Status = TaskStatus.NotStarted,
            UpdatedAt = timeNow
        };

        var expectedEntity = new TaskDetailsEntity
        {
            Name = "task name",
            Priority = 13,
            Status = 0,
            UpdatedAt = timeNow
        };

        // act
        var entity = TaskEntityMapper.FromDomain(domain);

        // assert
        Assert.Equal(expectedEntity, entity);
    }

    [Fact]
    public void ConvertEntityToDomain()
    {
        //arrange
        var timeNow = DateTime.UtcNow;
        var entity = new TaskDetailsEntity
        {
            Name = "task name",
            Priority = 13,
            Status = 0,
            UpdatedAt = timeNow
        };

        var expectedDomain = new TaskDetails
        {
            Name = "task name",
            Priority = 13,
            Status = TaskStatus.NotStarted,
            UpdatedAt = timeNow
        };

        // act
        var domain = TaskEntityMapper.ToDomain(entity);

        // assert
        Assert.Equal(expectedDomain, domain);
    }
}
