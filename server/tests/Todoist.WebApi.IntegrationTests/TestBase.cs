using RestSharp;
using Todoist.WebApi.IntegrationTests.Fixtures;
using Xunit;

namespace Todoist.WebApi.IntegrationTests;

public abstract class TestBase : IClassFixture<RestClientFixture>
{
    private readonly RestClientFixture _fixture;

    protected TestBase(RestClientFixture fixture)
    {
        _fixture = fixture;
    }

    protected RestClient RestClient => _fixture.Client;
}
