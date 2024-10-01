using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_cqrs_eventsourcing_lib.EventStore;
using airo_cqrs_eventsourcing_lib.Web;

using airo_event_subscriptions_domain.Domain.Aggregates;
using airo_event_subscriptions_domain.Domain.Read;
using airo_event_subscriptions_domain.Domain.Write.Events;
using airo_event_subscriptions_domain.Domain.Write.Events.Handlers;
using airo_event_subscriptions_microservice.Services.Impl;
using airo_event_subscriptions_microservice.Services.Interfaces;

using EventStore.Client;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CQRS - Event Sourcing Framework
builder.Services.AddMediatR(cfg =>
{
    // Register all handlers from the assembly where your command/query handlers are defined
    cfg.RegisterServicesFromAssemblyContaining<EventSubscriptionAggregate>();
});

var purchaseApiUrl = builder.Configuration["PURCHASE_API_URL"];
builder.Services.AddHttpClient<IPurchaseService>(client =>
{
    client.BaseAddress = new Uri(purchaseApiUrl);
    //client.DefaultRequestHeaders.Add("Accept", "application/json");
});

var rabbitMqUrl = builder.Configuration["RABBITMQ_URL"];
builder.Services.AddSingleton<IRabbitMQPublisherService>(sp => new RabbitMQPublisherService(rabbitMqUrl));

var eventStoreDbConnectionString = builder.Configuration["EVENT_STORE_DB_URL"];

var settings = EventStoreClientSettings.Create(eventStoreDbConnectionString);
var eventStoreClient = new EventStoreClient(settings);
var eventStore = new EventStoreDb(eventStoreClient);

builder.Services.RegisterHandlers(typeof(EventSubscriptionAggregate).Assembly);

builder.Services.AddSingleton<IEventStore>(eventStore);
builder.Services.AddSingleton<AggregateRepository<EventSubscriptionAggregate>>();
builder.Services.AddSingleton<IReadRepository<EventSubscriptionReadModel>, EventSubscriptionReadRepository>();
builder.Services.AddSingleton<IEventListener, EventListener<EventSubscriptionReadModel>>(provider =>
{
    // Get the required services from the service provider
    var readRepository = provider.GetRequiredService<IReadRepository<EventSubscriptionReadModel>>();

    // Create the EventListener instance
    var eventListener = new EventListener<EventSubscriptionReadModel>(readRepository);

    // Bind the event handlers
    eventListener.Bind<EventSubscribedEvent, EventSubscribedEventHandler>();
    eventListener.Bind<EventUnsubscribedEvent, EventUnsubscribedEventHandler>();

    return eventListener;
});

builder.Services.AddHostedService(provider =>
{
    var eventListener = provider.GetRequiredService<IEventListener>();
    var eventStore = provider.GetRequiredService<IEventStore>();

    // events that do NOT start with "airo_event_subscriptions" will be ignored
    var eventListenerBackgroundService = new EventListenerBackgroundService(eventListener, eventStore, "airo_event_subscriptions");

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
