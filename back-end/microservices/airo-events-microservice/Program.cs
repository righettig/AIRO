using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_cqrs_eventsourcing_lib.EventStore;
using airo_cqrs_eventsourcing_lib.Web;

using airo_events_microservice.Domain.Aggregates;
using airo_events_microservice.Domain.Read;
using airo_events_microservice.Domain.Write.Events;
using airo_events_microservice.Domain.Write.Events.Handlers;

using EventStore.Client;

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

var settings = EventStoreClientSettings.Create(eventStoreDbConnectionString);
var eventStoreClient = new EventStoreClient(settings);
var eventStore = new EventStoreDb(eventStoreClient);

builder.Services.RegisterHandlers(typeof(EventAggregate).Assembly);

builder.Services.AddSingleton<IEventStore>(eventStore);
builder.Services.AddSingleton<AggregateRepository<EventAggregate>>();
builder.Services.AddSingleton<IReadRepository<EventReadModel>, EventReadRepository>();
builder.Services.AddSingleton<IEventListener, EventListener<EventReadModel>>(provider =>
{
    // Get the required services from the service provider
    var readRepository = provider.GetRequiredService<IReadRepository<EventReadModel>>();

    // Create the EventListener instance
    var eventListener = new EventListener<EventReadModel>(readRepository);

    // Bind the event handlers
    eventListener.Bind<EventCreatedEvent, EventCreatedEventHandler>();
    eventListener.Bind<EventDeletedEvent, EventDeletedEventHandler>();
    eventListener.Bind<EventUpdatedEvent, EventUpdatedEventHandler>();

    return eventListener;
});

builder.Services.AddHostedService(provider =>
{
    var eventListener = provider.GetRequiredService<IEventListener>();
    var eventStore = provider.GetRequiredService<IEventStore>();

    // events that do NOT start with "airo_events" will be ignored
    var eventListenerBackgroundService = new EventListenerBackgroundService(eventListener, eventStore, "airo_events");

    return eventListenerBackgroundService;
});

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
