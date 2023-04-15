using System.Net;
using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using Todoist.WebApi.IntegrationTests.Fixtures;
using Xunit;

namespace Todoist.WebApi.IntegrationTests;

public class TaskControllerShould : TestBase
{
    public TaskControllerShould(RestClientFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task ReturnErrorOnCreatingTaskWithInvalidStatus()
    {
        // arrange
        var request = new RestRequest("v1/task/test")
            .AddJsonBody(new { status = "Do Not Exist", priority = 1});

        // act
        var response = await RestClient.ExecutePostAsync(request);

        // assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData(555)]
    [InlineData(101)]
    [InlineData(-2)]
    public async Task ReturnErrorOnCreatingTaskWithInvalidPriority(int priority)
    {
        // arrange
        var request = new RestRequest("v1/task/test")
            .AddJsonBody(new { status = "NotStarted", priority});

        // act
        var response = await RestClient.ExecutePostAsync(request);

        // assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("test-post")]
    [InlineData("test post")]
    [InlineData("test@ post#5")]
    public async Task ReturnSuccessOnCreatingValidTask(string taskName)
    {
        // arrange
        var request = new RestRequest($"v1/task/{taskName}")
            .AddJsonBody(new { status = "NotStarted", priority = 0});

        // act
        var response = await RestClient.ExecutePostAsync(request);

        // assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        // clean-up
        await RemoveTask(taskName);
    }

    [Fact]
    public async Task ReturnErrorOnCreatingDuplicatedTask()
    {
        // arrange
        const string TaskName = "test-post";
        var request = new RestRequest($"v1/task/{TaskName}")
            .AddJsonBody(new { status = "NotStarted", priority = 0});

        // act
        // first addition of a task
        var response = await RestClient.ExecutePostAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        // second addition of a task
        var responseDuplicate = await RestClient.ExecutePostAsync(request);
        responseDuplicate.StatusCode.Should().Be(HttpStatusCode.Conflict);

        // clean-up
        await RemoveTask(TaskName);
    }

    [Fact]
    public async Task ReturnErrorOnRemovingUnExistingTask()
    {
        // arrange
        const string TaskName = "do not exist";
        var request = new RestRequest($"v1/task/{TaskName}");

        // act
        var response = await RestClient.ExecuteAsync(request, Method.Delete);

        // arrange
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Theory]
    [InlineData("NotStarted")]
    [InlineData("InProgress")]
    public async Task ReturnErrorOnRemovingNotCompletedTask(string status)
    {
        // arrange
        const string TaskName = "test-delete";

        // first step is to create a task
        var request = new RestRequest($"v1/task/{TaskName}")
            .AddJsonBody(new { status, priority = 0});
        var responseToAdd = await RestClient.ExecutePostAsync(request);
        responseToAdd.StatusCode.Should().Be(HttpStatusCode.Created);

        // act
        var requestToDelete = new RestRequest($"v1/task/{TaskName}");
        var responseForRemoval = await RestClient.ExecuteAsync(requestToDelete, Method.Delete);

        // arrange
        responseForRemoval.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        // clean-up
        await RemoveTask(TaskName);
    }

    [Fact]
    public async Task ReturnListOfTasks()
    {
        // arrange
        // add one task
        const string TaskName = "test-list";
        var requestToAdd = new RestRequest($"v1/task/{TaskName}")
            .AddJsonBody(new { status = "NotStarted", priority = 0});
        await RestClient.ExecutePostAsync(requestToAdd);

        // build request to list API endpoint
        var request = new RestRequest("v1/tasks");

        // act
        var response = await RestClient.ExecuteGetAsync(request);

        // assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        Assert.NotNull(response.Content);

        // clean-up
        await RemoveTask(TaskName);
    }

    [Theory]
    [InlineData("test-get")]
    [InlineData("test get")]
    public async Task ReturnTaskOnRequest(string taskName)
    {
        // arrange
        var expected = JObject.FromObject(
            new { name = taskName, priority = 0, status = "NotStarted" });

        // add one task
        var requestToAdd = new RestRequest($"v1/task/{taskName}")
            .AddJsonBody(new { status = "NotStarted", priority = 0});
        await RestClient.ExecutePostAsync(requestToAdd);

        // build request to get task API endpoint
        var request = new RestRequest($"v1/task/{taskName}");

        // act
        var response = await RestClient.ExecuteGetAsync(request);

        // assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        Assert.NotNull(response.Content);

        var task = JsonConvert.DeserializeObject<JObject>(response.Content);
        Assert.Equal(expected, task);

        // clean-up
        await RemoveTask(taskName);
    }

    [Theory]
    [InlineData("test-update", "InProgress", 3)]
    [InlineData("test update", "Completed", 99)]
    public async Task ReturnSuccessOnUpdatingTask(string taskName, string status, byte priority)
    {
        // arrange
        var expected = JObject.FromObject(
            new { name = taskName, priority, status });

        // add one task
        var requestToAdd = new RestRequest($"v1/task/{taskName}")
            .AddJsonBody(new { status = "NotStarted", priority = 0});
        await RestClient.ExecutePostAsync(requestToAdd);

        // build request to update task API endpoint
        var request = new RestRequest($"v1/task/{taskName}")
            .AddJsonBody(new { status, priority});

        // act
        var response = await RestClient.ExecutePutAsync(request);

        // assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // check the task data
        var requestToGet = new RestRequest($"v1/task/{taskName}");

        // act
        var responseOnGet = await RestClient.ExecuteGetAsync(requestToGet);

        // assert
        responseOnGet.StatusCode.Should().Be(HttpStatusCode.OK);
        Assert.NotNull(responseOnGet.Content);

        var task = JsonConvert.DeserializeObject<JObject>(responseOnGet.Content);
        Assert.Equal(expected, task);

        // clean-up
        await RemoveTask(taskName);
    }

    [Fact]
    public async Task ReturnErrorOnUpdatingUnExistingTask()
    {
        // arrange
        const string TaskName = "Do Not Exist";
        var requestToAdd = new RestRequest($"v1/task/{TaskName}")
            .AddJsonBody(new { status = "NotStarted", priority = 0});

        // act
        var response = await RestClient.ExecutePutAsync(requestToAdd);

        // assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    private async Task RemoveTask(string taskName)
    {
        // change the status of the task so we bypass Validation rules for deletion
        var requestToUpdate = new RestRequest($"v1/task/{taskName}")
            .AddJsonBody(new { status="Completed", priority = 0});
        var response = await RestClient.ExecutePutAsync(requestToUpdate);
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // remove the task
        var requestToRemove = new RestRequest($"v1/task/{taskName}");
        response = await RestClient.ExecuteAsync(requestToRemove, Method.Delete);
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}
