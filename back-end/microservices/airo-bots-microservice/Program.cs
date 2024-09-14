using airo_bots_microservice;
using airo_bots_microservice.Domain.Aggregates;
using airo_bots_microservice.Domain.Read;
using airo_bots_microservice.Domain.Write.Events;
using airo_bots_microservice.Domain.Write.Events.Handlers;
using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CQRS - Event Sourcing Framework
builder.Services.AddMediatR(cfg =>
{
    // Register all handlers from the assembly where your command/query handlers are defined
    cfg.RegisterServicesFromAssemblyContaining<BotAggregate>();
});

var eventStoreDbConnectionString = builder.Configuration["EVENT_STORE_DB_URL"];
builder.Services.AddEventStoreClient(eventStoreDbConnectionString);

builder.Services.AddSingleton<IEventStore, airo_cqrs_eventsourcing_lib.Impl.EventStore>();

builder.Services.RegisterHandlers(typeof(BotAggregate).Assembly);

builder.Services.AddSingleton<AggregateRepository<BotAggregate>>();

builder.Services.AddSingleton<IReadRepository<BotReadModel>, BotReadRepository>();

builder.Services.AddSingleton<IEventListener, EventListener<BotReadModel>>(provider =>
{
    // Get the required services from the service provider
    var readRepository = provider.GetRequiredService<IReadRepository<BotReadModel>>();
    var eventStore = provider.GetRequiredService<IEventStore>();

    // Create the EventListener instance
    var eventListener = new EventListener<BotReadModel>(eventStore, readRepository);

    // Bind the event handlers
    eventListener.Bind<BotCreatedEvent, BotCreatedEventHandler>();
    eventListener.Bind<BotDeletedEvent, BotDeleteEventHandler>();
    eventListener.Bind<BotUpdatedEvent, BotUpdatedEventHandler>();

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
