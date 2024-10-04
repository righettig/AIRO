using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_cqrs_eventsourcing_lib.Web;

using airo_events_microservice.Domain.Aggregates;
using airo_events_microservice.Domain.Read;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CQRS - Event Sourcing Framework
builder.Services.AddMediatR(cfg =>
{
    // Register all handlers from the assembly where your command/query handlers are defined
    cfg.RegisterServicesFromAssemblyContaining<EventAggregate>();
});

var eventStoreDbConnectionString = builder.Configuration["EVENT_STORE_DB_URL"];

builder.Services.AddEventStore(eventStoreDbConnectionString);

builder.Services.RegisterHandlers(typeof(EventAggregate).Assembly);

builder.Services.AddSingleton<AggregateRepository<EventAggregate>>();
builder.Services.AddSingleton<IReadRepository<EventReadModel>, EventReadRepository>();

builder.Services.AddEventListener<EventReadModel>(typeof(EventReadModel).Assembly);

builder.Services.AddEventListenerBackgroundService("airo_events");

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
