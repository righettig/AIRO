using airo_cqrs_eventsourcing_lib.Web;

using airo_purchase_microservice.Domain.Aggregates;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var eventStoreDbConnectionString = builder.Configuration["EVENT_STORE_DB_URL"];

builder.Services
    .AddEventStore(eventStoreDbConnectionString)
    .AddCQRS(typeof(PurchaseAggregate))
    .WithEvents("airo_purchase");

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
