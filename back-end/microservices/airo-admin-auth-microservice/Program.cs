using airo_admin_auth_microservice.Services;
using airo_common_lib.Extensions;
using airo_common_lib.HealthChecks;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Firebase project configuration
var firebaseProjectName = builder.Configuration["FIREBASE_PROJECT_NAME"];
var firebaseApiKey = builder.Configuration["FIREBASE_API_KEY"];
var firebaseConfigFile = builder.Configuration["FIREBASE_CONFIG_FILE"];

builder.Services.AddFirebaseAuthClient(firebaseApiKey, firebaseProjectName);
builder.Services.AddFirebaseAndFirestore(firebaseConfigFile, firebaseProjectName);

// Add custom Firebase Authentication service
builder.Services.AddSingleton<IAuthService, FirebaseAuthService>();

// Set up JWT Bearer authentication
builder.Services.AddJWTBearerAuthentication(firebaseProjectName, builder.Configuration["JWT_AUTHORITY"]);

// Add controllers and Swagger for API documentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks()
                .AddCheck<FirebaseHealthCheck>("firebase_health_check");

var corsAllowedOrigins = builder.Configuration["CORS_ALLOWED_ORIGINS"]?.Split(',') ?? [];

builder.Services.AddCors(corsAllowedOrigins);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("AllowLocalApps");

app.MapControllers();

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new { name = e.Key, status = e.Value.Status.ToString() }),
            totalDuration = report.TotalDuration.TotalMilliseconds
        });
        await context.Response.WriteAsync(result);
    }
});

app.Run();
