using airo_cqrs_eventsourcing_lib.Web;

using airo_events_microservice.Domain.Aggregates;
using airo_events_microservice.Services.Impl;
using airo_events_microservice.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var rabbitMqUrl = builder.Configuration["RABBITMQ_URL"];
builder.Services.AddSingleton<IRabbitMQPublisherService>(sp => new RabbitMQPublisherService(rabbitMqUrl));

var eventStoreDbConnectionString = builder.Configuration["EVENT_STORE_DB_URL"];

builder.Services
    .AddEventStore(eventStoreDbConnectionString)
    .AddCQRS(typeof(EventAggregate))
    .WithEvents("airo_events");

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
