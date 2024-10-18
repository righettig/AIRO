using airo_common_lib.Extensions;
using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Impl;
using airo_event_simulation_engine.Interfaces;
using airo_event_simulation_infrastructure.Impl;
using airo_event_simulation_infrastructure.Interfaces;
using airo_event_simulation_microservice.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHostedService<SimulationHostedService>();

builder.Services.AddSingleton<ISimulationService, SimulationService>();
builder.Services.AddSingleton<IBotBehavioursService, BotBehavioursService>();
builder.Services.AddSingleton<IEventSubscriptionService, EventSubscriptionService>();
builder.Services.AddSingleton<IBehaviourExecutor, BehaviourExecutor>();

builder.Services.AddSingleton<IBackgroundTaskQueue, SimulationTaskQueue>();
builder.Services.AddSingleton<ISimulationStatusTracker, SimulationStatusTracker>();
builder.Services.AddSingleton<IEventsService, EventsService>();
builder.Services.AddSingleton<ISimulationStateUpdater, DummyStateUpdater>();

builder.Services.AddDefaultTimeProvider();

builder.Services.AddHttpClient<IEventsService, EventsService>(client =>
{
    var baseApiUrl = builder.Configuration["EVENTS_API_URL"];
    client.BaseAddress = new Uri(baseApiUrl + "/api/");
});

builder.Services.AddHttpClient<IEventSubscriptionService, EventSubscriptionService>(client =>
{
    var baseApiUrl = builder.Configuration["EVENT_SUBSCRIPTION_API_URL"];
    client.BaseAddress = new Uri(baseApiUrl + "/api/");
});

builder.Services.AddHttpClient<IBotBehavioursService, BotBehavioursService>(client =>
{
    var baseApiUrl = builder.Configuration["BOT_BEHAVIOURS_API_URL"];
    client.BaseAddress = new Uri(baseApiUrl + "/api/");
});

builder.Services.AddTransient<ISimulationEngine, SimulationEngine>();

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();
app.Run();
