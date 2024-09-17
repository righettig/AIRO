using anybotics_anymal_api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Firebase project configuration
var firebaseProjectName = builder.Configuration["FIREBASE_PROJECT_NAME"];
var firebaseConfigFile = builder.Configuration["FIREBASE_CONFIG_FILE"];

// Add services to the container.
builder.Services.AddCustomServices(firebaseConfigFile, firebaseProjectName);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCustomMiddleware();

app.Run();
