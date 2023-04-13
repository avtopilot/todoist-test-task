using Microsoft.Extensions.DependencyInjection;
using Todoist.Storage.Abstractions.Repositories;
using Todoist.Storage.InMemory.Repositories;

namespace Todoist.Storage.InMemory;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddInMemoryStorage(this IServiceCollection services) =>
        services.AddSingleton<ITaskRepository, TaskRepository>();
}