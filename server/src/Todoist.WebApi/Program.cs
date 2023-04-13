using Todoist.Storage.InMemory;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInMemoryStorage();

builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddApiVersioning();
builder.Services.AddVersionedApiExplorer(
    options =>
    {
        // add the versioned api explorer, which also adds IApiVersionDescriptionProvider service
        // note: the specified format code will format the version as "'v'major[.minor][-status]"
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });

var app = builder.Build();

app.Run();