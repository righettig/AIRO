using anybotics_anymal_api.Extensions;
using Microsoft.AspNetCore.Server.Kestrel.Core;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5001, listenOptions =>
    {
        // Use HTTP/2 for gRPC on this port
        listenOptions.Protocols = HttpProtocols.Http2;
    });

    options.ListenAnyIP(5002, listenOptions =>
    {
        // Use HTTP/1.1 for SignalR on this port
        listenOptions.Protocols = HttpProtocols.Http1;
    });
});

// Firebase project configuration
var firebaseProjectName = builder.Configuration["FIREBASE_PROJECT_NAME"];
var firebaseConfigFile = builder.Configuration["FIREBASE_CONFIG_FILE"];

// Add services to the container.
builder.Services.AddCustomServices(firebaseConfigFile, firebaseProjectName);

var corsAllowedOrigins = builder.Configuration["CORS_ALLOWED_ORIGINS"]?.Split(',') ?? [];

builder.Services.AddCors(corsAllowedOrigins);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCustomMiddleware();

app.Run();
