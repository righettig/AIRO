using airo_leaderboard_microservice.Common.Data.Interfaces;
using StackExchange.Redis;
using System.Text.Json;

namespace airo_leaderboard_microservice.Common.Data.Impl;

public class RedisCache<T>(IConnectionMultiplexer connection, string prefix) : IRedisCache<T> where T : ILeaderboardEntry
{
    private readonly IDatabase _database = connection.GetDatabase();

    public Task<T?> GetEntryAsync(string id)
    {
        return GetEntryFromKeyAsync($"{prefix}:{id}");
    }

    public async Task<List<T>> GetTopNEntriesAsync(int n)
    {
        var result = await _database.ExecuteAsync("KEYS", $"{prefix}:*");
        var keys = ((string?[]?)result);
        var tasks = keys.Select(GetEntryFromKeyAsync);
        var entries = await Task.WhenAll(tasks);
        return entries.OrderByDescending(e => e.Wins).Take(n).ToList();
    }

    public async Task SetEntryAsync(T entry)
    {
        var json = JsonSerializer.Serialize(entry);
        await _database.StringSetAsync($"{prefix}:{entry.Id}", json);
    }

    private async Task<T?> GetEntryFromKeyAsync(string key)
    {
        var entry = await _database.StringGetAsync(key);
        return entry.IsNull ? default : JsonSerializer.Deserialize<T>(entry);
    }
}
