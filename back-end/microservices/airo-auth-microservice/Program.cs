using airo_auth_microservice.Extensions;
using airo_auth_microservice.Services;
using Firebase.Auth;
using Firebase.Auth.Providers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Firebase project configuration
var firebaseProjectName = builder.Configuration["FIREBASE_PROJECT_NAME"];
var firebaseApiKey = builder.Configuration["FIREBASE_API_KEY"];
var firebaseConfigFile = builder.Configuration["FIREBASE_CONFIG_FILE"];

var corsAllowedOrigins = builder.Configuration["CORS_ALLOWED_ORIGINS"]?.Split(',') ?? [];

builder.Services.AddSingleton(new FirebaseAuthClient(new FirebaseAuthConfig
{
    ApiKey = firebaseApiKey,
    AuthDomain = $"{firebaseProjectName}.firebaseapp.com",
    Providers = [new EmailProvider()]
}));

builder.Services.AddFirebaseAndFirestore(firebaseConfigFile, firebaseProjectName);

// Add custom Firebase Authentication service
builder.Services.AddSingleton<IFirebaseAuthService, FirebaseAuthService>();

// Set up JWT Bearer authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["JWT_AUTHORITY"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = options.Authority,
            ValidateAudience = true,
            ValidAudience = firebaseProjectName,
            ValidateLifetime = true
        };
    });

// Add controllers and Swagger for API documentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalApps", policyBuilder =>
    {
        policyBuilder.WithOrigins(corsAllowedOrigins)
                     .AllowAnyHeader()
                     .AllowAnyMethod()
                     .AllowCredentials();
    });
});

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
