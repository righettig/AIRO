using airo_leaderboard_microservice.Common.Data.Interfaces;
using airo_leaderboard_microservice.Common.Services.Interfaces;

namespace airo_leaderboard_microservice.Common.Services.Impl;

public class LeaderboardWriteService<T>(IRedisCache<T> redis, ICosmosDbContext<T> cosmos) : ILeaderboardWriteService <T>
    where T : class, ILeaderboardEntry, new()
{
    private readonly IRedisCache<T> redis = redis;
    private readonly ICosmosDbContext<T> cosmos = cosmos;

    public async Task MarkAsLoser(string id)
    {
        // update redis cache entry
        var entry = await redis.GetEntryAsync(id) ?? new T();

        entry.Id ??= id;
        entry.TotalEvents += 1;
        entry.Losses += 1;

        await redis.SetEntryAsync(entry);
        Console.WriteLine("Updated Redis entry: " + id);

        // update db entry
        await cosmos.CreateOrUpdateEntryAsync(entry);
        Console.WriteLine("Updated CosmosDb entry: " + id);
    }

    public async Task MarkAsWinner(string id)
    {
        // update redis cache entry
        var entry = await redis.GetEntryAsync(id) ?? new T();

        entry.Id ??= id;
        entry.TotalEvents += 1;
        entry.Wins += 1;

        await redis.SetEntryAsync(entry);
        Console.WriteLine("Updated Redis entry: " + id);

        // update db entry
        await cosmos.CreateOrUpdateEntryAsync(entry);
        Console.WriteLine("Updated CosmosDb entry: " + id);
    }
}
