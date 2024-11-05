using airo_bot_behaviour_compiler_microservice.Impl;
using airo_bot_behaviour_compiler_microservice.Interfaces;
using Azure.Storage.Blobs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var blobConnectionString = builder.Configuration.GetConnectionString("AzureBlobStorage");
builder.Services.AddSingleton(new BlobServiceClient(blobConnectionString));

var rabbitMqUrl = builder.Configuration["RABBITMQ_URL"];
builder.Services.AddSingleton<IRabbitMQPublisherService>(sp => new RabbitMQPublisherService(rabbitMqUrl));

builder.Services.AddSingleton<IBehaviourCompiler, CSharpBehaviourCompiler>();
builder.Services.AddSingleton<IBotBehaviorStorageService, BotBehaviorStorageService>();

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
