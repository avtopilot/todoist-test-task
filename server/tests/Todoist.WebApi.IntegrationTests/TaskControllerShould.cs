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
    [InlineData("test")]
    [InlineData("test space")]
    [InlineData("test@ #5")]
    public async Task ReturnSuccessOnCreatingValidTask(string taskName)
    {
        // arrange
        var request = new RestRequest($"v1/task/{taskName}")
            .AddJsonBody(new { status = "NotStarted", priority = 0});

        // act
        var response = await RestClient.ExecutePostAsync(request);

        // assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        // remove the record
        var requestToRemove = new RestRequest($"v1/task/{taskName}");
        var responseForRemoval = await RestClient.DeleteAsync(requestToRemove);

        // validate successfully removed
        responseForRemoval.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task ReturnErrorOnCreatingDuplicatedTask()
    {
        // arrange
        const string TaskName = "test";
        var request = new RestRequest($"v1/task/{TaskName}")
            .AddJsonBody(new { status = "NotStarted", priority = 0});

        // act
        // first addition of a task
        var response = await RestClient.ExecutePostAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        // second addition of a task
        var responseDuplicate = await RestClient.ExecutePostAsync(request);
        responseDuplicate.StatusCode.Should().Be(HttpStatusCode.Conflict);

        // remove the record
        var requestToRemove = new RestRequest($"v1/task/{TaskName}");
        var responseForRemoval = await RestClient.DeleteAsync(requestToRemove);

        // validate successfully removed
        responseForRemoval.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task ReturnErrorOnRemovingUnExistingTask()
    {
        // arrange
        const string TaskName = "do not exist";
        var request = new RestRequest($"v1/task/{TaskName}");

        // act
        var response = await RestClient.DeleteAsync(request);

        // arrange
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ReturnListOfTasks()
    {
        // arrange
        // add one task
        const string TaskName = "test";
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

        // remove added task
        var requestToRemove = new RestRequest($"v1/task/{TaskName}");
        var responseForRemoval = await RestClient.DeleteAsync(requestToRemove);

        // validate successfully removed
        responseForRemoval.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Theory]
    [InlineData("test")]
    [InlineData("test space")]
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

        // remove added task
        var requestToRemove = new RestRequest($"v1/task/{taskName}");
        var responseForRemoval = await RestClient.DeleteAsync(requestToRemove);

        // validate successfully removed
        responseForRemoval.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Theory]
    [InlineData("test", "InProgress", 3)]
    [InlineData("test space", "Completed", 99)]
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

        // remove added task
        var requestToRemove = new RestRequest($"v1/task/{taskName}");
        var responseForRemoval = await RestClient.DeleteAsync(requestToRemove);

        // validate successfully removed
        responseForRemoval.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}
