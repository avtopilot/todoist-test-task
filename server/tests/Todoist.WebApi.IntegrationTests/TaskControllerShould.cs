using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using FluentAssertions;
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
    public async Task ReturnListOfTasks()
    {
        // arrange
        var request = new RestRequest("v1/tasks");

        // act
        var response = await RestClient.ExecuteGetAsync(request);

        // assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
