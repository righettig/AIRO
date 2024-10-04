using airo_cqrs_eventsourcing_lib.Web;

using airo_event_subscriptions_domain.Domain.Aggregates;
using airo_event_subscriptions_microservice.Services.Impl;
using airo_event_subscriptions_microservice.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IPurchaseService, PurchaseService>();

builder.Services.AddHttpClient<IPurchaseService, PurchaseService>(client =>
{
    var purchaseApiUrl = builder.Configuration["PURCHASE_API_URL"];
    client.BaseAddress = new Uri(purchaseApiUrl + "/api/");
});

var rabbitMqUrl = builder.Configuration["RABBITMQ_URL"];
builder.Services.AddSingleton<IRabbitMQPublisherService>(sp => new RabbitMQPublisherService(rabbitMqUrl));

var eventStoreDbConnectionString = builder.Configuration["EVENT_STORE_DB_URL"];

builder.Services
    .AddEventStore(eventStoreDbConnectionString)
    .AddCQRS(typeof(EventSubscriptionAggregate))
    .WithEvents("airo_event_subscriptions");

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
