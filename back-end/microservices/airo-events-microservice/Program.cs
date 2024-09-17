using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;
using airo_events_microservice;
using airo_events_microservice.Domain.Aggregates;
using airo_events_microservice.Domain.Read;
using airo_events_microservice.Domain.Write.Events;
using airo_events_microservice.Domain.Write.Events.Handlers;

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
builder.Services.AddEventStoreClient(eventStoreDbConnectionString);

builder.Services.AddSingleton<IEventStore, airo_cqrs_eventsourcing_lib.Impl.EventStore>();

builder.Services.RegisterHandlers(typeof(EventAggregate).Assembly);

builder.Services.AddSingleton<AggregateRepository<EventAggregate>>();

builder.Services.AddSingleton<IReadRepository<EventReadModel>, EventReadRepository>();

builder.Services.AddSingleton<IEventListener, EventListener<EventReadModel>>(provider =>
{
    // Get the required services from the service provider
    var readRepository = provider.GetRequiredService<IReadRepository<EventReadModel>>();
    var eventStore = provider.GetRequiredService<IEventStore>();

    // Create the EventListener instance
    var eventListener = new EventListener<EventReadModel>(eventStore, readRepository);

    // Bind the event handlers
    eventListener.Bind<EventCreatedEvent, EventCreatedEventHandler>();
    eventListener.Bind<EventDeletedEvent, EventDeletedEventHandler>();
    eventListener.Bind<EventUpdatedEvent, EventUpdatedEventHandler>();

    return eventListener;
});

builder.Services.AddHostedService<EventListenerBackgroundService>();

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
