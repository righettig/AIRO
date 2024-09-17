using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;
using airo_purchase_microservice;
using airo_purchase_microservice.Domain.Aggregates;
using airo_purchase_microservice.Domain.Read;
using airo_purchase_microservice.Domain.Write.Events;
using airo_purchase_microservice.Domain.Write.Events.Handlers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CQRS - Event Sourcing Framework
builder.Services.AddMediatR(cfg =>
{
    // Register all handlers from the assembly where your command/query handlers are defined
    cfg.RegisterServicesFromAssemblyContaining<PurchaseAggregate>();
});

var eventStoreDbConnectionString = builder.Configuration["EVENT_STORE_DB_URL"];
builder.Services.AddEventStoreClient(eventStoreDbConnectionString);

builder.Services.AddSingleton<IEventStore, airo_cqrs_eventsourcing_lib.Impl.EventStore>();

builder.Services.RegisterHandlers(typeof(PurchaseAggregate).Assembly);

builder.Services.AddSingleton<AggregateRepository<PurchaseAggregate>>();

builder.Services.AddSingleton<IReadRepository<PurchaseReadModel>, PurchaseReadRepository>();

builder.Services.AddSingleton<IEventListener, EventListener<PurchaseReadModel>>(provider =>
{
    // Get the required services from the service provider
    var readRepository = provider.GetRequiredService<IReadRepository<PurchaseReadModel>>();
    var eventStore = provider.GetRequiredService<IEventStore>();

    // Create the EventListener instance
    var eventListener = new EventListener<PurchaseReadModel>(eventStore, readRepository);

    // Bind the event handlers
    eventListener.Bind<BotPurchasedEvent, BotPurchasedEventHandler>();

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
