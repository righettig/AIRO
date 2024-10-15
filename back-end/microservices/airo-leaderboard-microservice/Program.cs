using airo_leaderboard_microservice.Behaviours;
using airo_leaderboard_microservice.Common.Data.Impl;
using airo_leaderboard_microservice.Common.Data.Interfaces;
using airo_leaderboard_microservice.Common.Services.Impl;
using airo_leaderboard_microservice.Common.Services.Interfaces;
using airo_leaderboard_microservice.Users;
using Microsoft.Azure.Cosmos;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register services
builder.Services.AddSingleton<IEventCompletedProcessor, EventCompletedProcessor>();
builder.Services.AddSingleton<IEventSubscriptionService, EventSubscriptionService>();

builder.Services.AddHttpClient<IEventSubscriptionService, EventSubscriptionService>(client =>
{
    var baseApiUrl = builder.Configuration["EVENT_SUBSCRIPTION_API_URL"];
    client.BaseAddress = new Uri(baseApiUrl + "/api/");
});

// Configure Redis
var redisUrl = builder.Configuration["REDIS_URL"];

var redis = ConnectionMultiplexer.Connect(redisUrl);
builder.Services.AddSingleton<IConnectionMultiplexer>(redis);

// Configure CosmosDB
var cosmosDbEndpoint = builder.Configuration["COSMOSDB_ENDPOINT"];
var cosmosDbKey = builder.Configuration["COSMOSDB_KEY"];
var leaderboardsDb = builder.Configuration["LEADERBOARD_DB"] ?? "airo-leaderboards";

// avoid SSL certificate issue on connect
var cosmosClientOptions = new CosmosClientOptions()
{
    HttpClientFactory = () =>
    {
        HttpMessageHandler httpMessageHandler = new HttpClientHandler()
        {
            ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        };

        return new HttpClient(httpMessageHandler);
    },
    ConnectionMode = ConnectionMode.Gateway
};

var cosmosClient = new CosmosClient(cosmosDbEndpoint, cosmosDbKey, cosmosClientOptions);
builder.Services.AddSingleton(cosmosClient);

// Register hosted services
var rabbitMqUrl = builder.Configuration["RABBITMQ_URL"];

builder.Services.AddHostedService(
    sp => new RabbitMqListener(sp.GetRequiredService<IEventCompletedProcessor>(), rabbitMqUrl));

builder.Services.AddHostedService(sp =>
{
    var logger = sp.GetRequiredService<ILogger<CosmosDbInitializationService>>();
    return new CosmosDbInitializationService(
        cosmosClient,
        logger,
        leaderboardsDb
    );
});

// Register leaderboard services for users and behaviours
RegisterLeaderboardServices<UserLeaderboardEntry>(builder.Services, cosmosClient, leaderboardsDb, "users");
RegisterLeaderboardServices<BehaviourLeaderboardEntry>(builder.Services, cosmosClient, leaderboardsDb, "behaviours");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();

void RegisterLeaderboardServices<T>(IServiceCollection services, CosmosClient client, string databaseId, string containerName) where T: class, ILeaderboardEntry, new()
{
    services.AddSingleton<IRedisCache<T>, RedisCache<T>>(
        sp => new RedisCache<T>(sp.GetRequiredService<IConnectionMultiplexer>(), containerName));

    services.AddSingleton<ICosmosDbContext<T>>(
        sp => new CosmosDbContext<T>(client, databaseId, containerName));

    services.AddSingleton<ILeaderboardReadService<T>, LeaderboardReadService<T>>();
    services.AddSingleton<ILeaderboardWriteService<T>, LeaderboardWriteService<T>>();

    services.AddHostedService(sp =>
    {
        var container = client.GetContainer(databaseId, containerName);
        var redis = sp.GetRequiredService<IRedisCache<T>>();
        return new CacheSyncService<T>(container, redis);
    });
}
