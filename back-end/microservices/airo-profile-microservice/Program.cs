using airo_common_lib.Extensions;
using airo_profile_microservice.Services;

var builder = WebApplication.CreateBuilder(args);

// Firebase project configuration
var firebaseProjectName = builder.Configuration["FIREBASE_PROJECT_NAME"];
var firebaseApiKey = builder.Configuration["FIREBASE_API_KEY"];
var firebaseConfigFile = builder.Configuration["FIREBASE_CONFIG_FILE"];

builder.Services.AddFirebaseAuthClient(firebaseApiKey, firebaseProjectName);
builder.Services.AddFirebaseAndFirestore(firebaseConfigFile, firebaseProjectName);

// Add custom Firebase Profile service
builder.Services.AddSingleton<IProfileService, FirebaseProfileService>();

// Set up JWT Bearer authentication
builder.Services.AddJWTBearerAuthentication(firebaseProjectName, builder.Configuration["JWT_AUTHORITY"]);

// Add controllers and Swagger for API documentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.Run();
