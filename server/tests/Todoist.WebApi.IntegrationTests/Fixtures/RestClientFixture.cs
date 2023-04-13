using RestSharp;

namespace Todoist.WebApi.IntegrationTests.Fixtures;

public class RestClientFixture
{
    public RestClientFixture()
    {
        var config = ConfigReader.LoadAppSettings();
        Client = new RestClient(config["Todoist:Uri"]!);
    }

    public RestClient Client { get; }
}
