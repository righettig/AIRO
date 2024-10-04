using airo_event_simulation_microservice.Impl;
using airo_event_simulation_microservice.Interfaces;
using airo_event_simulation_microservice.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHostedService<SimulationHostedService>();

builder.Services.AddSingleton<IBackgroundTaskQueue, SimulationTaskQueue>();
builder.Services.AddSingleton<ISimulationStatusTracker, SimulationStatusTracker>();
builder.Services.AddSingleton<IEventsService, EventsService>();

builder.Services.AddHttpClient<IEventsService, EventsService>(client =>
{
    var purchaseApiUrl = builder.Configuration["EVENTS_API_URL"];
    client.BaseAddress = new Uri(purchaseApiUrl + "/api/");
});

builder.Services.AddTransient<IGameSimulationEngine, GameSimulationEngine>();

builder.Services.AddSignalR();

var app = builder.Build();

app.MapPost("/simulate/{eventId}", (Guid eventId,
                                    ISimulationStatusTracker statusTracker,
                                    IBackgroundTaskQueue taskQueue,
                                    IGameSimulationEngine engine,
                                    GameSimulationParameters parameters,
                                    IEventsService eventsService) =>
{
    statusTracker.AddLog(eventId, "Simulation created");

    taskQueue.QueueBackgroundWorkItem(eventId, async token =>
    {
        await eventsService.MarkEventAsStartedAsync(eventId);
        statusTracker.AddLog(eventId, "Simulation started");

        var result = await engine.RunSimulationAsync(parameters, eventId, token);

        await eventsService.MarkEventAsCompletedAsync(eventId);
        statusTracker.AddLog(eventId, "Simulation marked as completed");

        // TODO Store result in the database
    });

    return Results.Accepted($"/simulate/{eventId}/status", new { EventId = eventId });
});

app.MapDelete("/simulate/{eventId}", (ISimulationStatusTracker statusTracker,
                                      IBackgroundTaskQueue taskQueue,
                                      Guid eventId) =>
{
    var wasCanceled = taskQueue.TryCancelSimulation(eventId);
    if (wasCanceled)
    {
        statusTracker.AddLog(eventId, $"Simulation {eventId} canceled.");
        return Results.Ok($"Simulation {eventId} canceled.");
    }
    return Results.NotFound($"Simulation {eventId} not found.");
});

app.MapGet("/simulate/{eventId}/status", (ISimulationStatusTracker statusTracker, Guid eventId) =>
{
    var status = statusTracker.GetSimulationStatus(eventId);
    if (status != null)
    {
        return Results.Ok(new
        {
            status.EventId,
            status.Logs
        });
    }
    return Results.NotFound($"Simulation {eventId} not found.");
});

app.MapHub<SimulationHub>("/hubs/simulation");

app.Run();
