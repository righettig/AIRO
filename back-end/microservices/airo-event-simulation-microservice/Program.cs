using airo_common_lib.Extensions;
using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.SimulationStateUpdaters;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Impl;
using airo_event_simulation_engine.Interfaces;
using airo_event_simulation_infrastructure.Impl;
using airo_event_simulation_infrastructure.Interfaces;
using airo_event_simulation_microservice.Services.Impl;
using airo_event_simulation_microservice.Services.Interfaces;
using Azure.Storage.Blobs;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// TODO: create event mode based on params "easy", "med", "hard"
var config = new SimulationConfig(botHpInitialAmount: 100,
                                  botHpDecayInterval: 10,
                                  foodRespawnInterval: 10,
                                  botHpDecayAmount: 5,
                                  botHpRestoreAmount: 20,
                                  turnDelaySeconds: 1); // DEBUG

builder.Services.AddSingleton<ISimulationConfig>(config);

builder.Services.AddHostedService<SimulationHostedService>();

builder.Services.AddSingleton<IMapsService, MapsService>();
builder.Services.AddSingleton<IEventSubscriptionService, EventSubscriptionService>();
builder.Services.AddSingleton<IBackgroundTaskQueue, SimulationTaskQueue>();
builder.Services.AddSingleton<ISimulationStatusTracker, SimulationStatusTracker>();
builder.Services.AddSingleton<IEventsService, EventsService>();
builder.Services.AddSingleton<ISimulationStateFactory, SimulationStateFactory>();
builder.Services.AddSingleton<ISimulationService, SimulationService>();
builder.Services.AddSingleton<ISimulationRepository, InMemorySimulationRepository>();
builder.Services.AddSingleton<IBotAgentFactory, BotAgentFactory>();

builder.Services.AddScoped<IBehaviourExecutor, BehaviourExecutor>();
builder.Services.AddScoped<ISimulationStateUpdater, StateUpdater>();

var redisUrl = builder.Configuration["REDIS_URL"];

var redis = ConnectionMultiplexer.Connect(redisUrl);
builder.Services.AddSingleton<IConnectionMultiplexer>(redis);

builder.Services.AddSingleton<IRedisCache, RedisCache>();

var blobConnectionString = builder.Configuration.GetConnectionString("AzureBlobStorage");
builder.Services.AddSingleton(new BlobServiceClient(blobConnectionString));

builder.Services.AddSingleton<IBlobStorageService, BlobStorageService>();
builder.Services.AddSingleton<RedisCacheUpdater>();

var rabbitMqUrl = builder.Configuration["RABBITMQ_URL"];

builder.Services.AddHostedService(provider =>
{
    var simulationService = provider.GetRequiredService<RedisCacheUpdater>();
    return new RabbitMqListener(rabbitMqUrl, simulationService);
});

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

builder.Services.AddHttpClient<IMapsService, MapsService>(client =>
{
    var baseApiUrl = builder.Configuration["MAPS_API_URL"];
    client.BaseAddress = new Uri(baseApiUrl + "/api/");
});

builder.Services.AddTransient<ISimulationEngine, SimulationEngine>();

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();
app.Run();
