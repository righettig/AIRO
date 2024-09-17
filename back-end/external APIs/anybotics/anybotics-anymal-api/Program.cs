using anybotics_anymal_api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCustomServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCustomMiddleware();

app.Run();
