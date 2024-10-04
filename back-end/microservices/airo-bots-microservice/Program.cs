using airo_bots_microservice.Domain.Aggregates;
using airo_bots_microservice.Domain.Read;

using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_cqrs_eventsourcing_lib.Web;

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

builder.Services.AddEventStore(eventStoreDbConnectionString);

builder.Services.RegisterHandlers(typeof(BotAggregate).Assembly);

builder.Services.AddSingleton<AggregateRepository<BotAggregate>>();
builder.Services.AddSingleton<IReadRepository<BotReadModel>, BotReadRepository>();

builder.Services.AddEventListener<BotReadModel>(typeof(BotReadModel).Assembly);

builder.Services.AddEventListenerBackgroundService("airo_bots");

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
