using airo_bot_behaviour_trainer_microservice.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IAnthropicApiClient, AnthropicApiClient>();
builder.Services.AddHttpClient<AnthropicApiClient>();

builder.Services.AddSingleton<IOpenAIService, OpenAIService>();
builder.Services.AddHttpClient<OpenAIService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
