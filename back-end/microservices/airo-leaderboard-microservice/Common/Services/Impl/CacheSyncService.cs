using airo_leaderboard_microservice.Common.Data.Interfaces;
using Microsoft.Azure.Cosmos;

namespace airo_leaderboard_microservice.Common.Services.Impl;

public class CacheSyncService<T>(Container cosmosDbContainer, IRedisCache<T> redis) : BackgroundService where T: ILeaderboardEntry
{
    private readonly Container _cosmosDbContainer = cosmosDbContainer;
    private readonly IRedisCache<T> _redis = redis;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var query = _cosmosDbContainer.GetItemQueryIterator<T>("SELECT * FROM c");

        while (query.HasMoreResults)
        {
            foreach (var entry in await query.ReadNextAsync(stoppingToken))
            {
                Console.WriteLine($"Reading {entry.Id} from cosmosb: {entry.Wins}, {entry.Losses}, {entry.TotalEvents}.");
                
                await _redis.SetEntryAsync(entry);

                Console.WriteLine($"Entry {entry.Id} written in RedisCache.");
            }
        }
    }
}