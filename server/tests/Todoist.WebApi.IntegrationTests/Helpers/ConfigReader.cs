using Microsoft.Extensions.Configuration;

internal static class ConfigReader
{
    public static IConfiguration LoadAppSettings() =>
        new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
}
