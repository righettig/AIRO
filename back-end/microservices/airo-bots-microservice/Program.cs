using airo_bots_microservice.Domain;
using airo_bots_microservice.Infrastructure;

using MediatR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();
builder.Services.AddMediatR(typeof(Program));
builder.Services.AddSingleton<IBotRepository, BotRepository>();

var eventStoreDbConnectionString = builder.Configuration["EVENT_STORE_DB_URL"];
builder.Services.AddEventStoreClient(eventStoreDbConnectionString);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
