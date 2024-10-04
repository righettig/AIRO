using airo_bots_microservice.Domain.Aggregates;

using airo_cqrs_eventsourcing_lib.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var eventStoreDbConnectionString = builder.Configuration["EVENT_STORE_DB_URL"];

builder.Services
    .AddEventStore(eventStoreDbConnectionString)
    .AddCQRS(typeof(BotAggregate))
    .WithEvents("airo_bots");

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
