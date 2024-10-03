using airo_event_simulation_microservice;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IBackgroundTaskQueue, SimulationTaskQueue>();
builder.Services.AddHostedService<SimulationHostedService>();
builder.Services.AddTransient<GameSimulationEngine>();

var app = builder.Build();

app.MapPost("/simulate", (IBackgroundTaskQueue taskQueue,
                          GameSimulationEngine engine,
                          GameSimulationParameters parameters) =>
{
    var simulationId = Guid.NewGuid().ToString();

    taskQueue.QueueBackgroundWorkItem(simulationId, async token =>
    {
        var result = await engine.RunSimulationAsync(parameters, token);
        // Store result in the database
    });

    return Results.Accepted($"/simulate/{simulationId}/status", new { SimulationId = simulationId });
});

app.MapDelete("/simulate/{id}", (IBackgroundTaskQueue taskQueue, string id) =>
{
    var wasCanceled = taskQueue.TryCancelSimulation(id);
    return wasCanceled ? Results.Ok($"Simulation {id} canceled.") : Results.NotFound($"Simulation {id} not found.");
});

app.MapGet("/simulate/{id}/status", (string id) =>
{
    Results.Ok("Retrieving state for simulation: " + id);
});

app.Run();
