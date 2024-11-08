using airo_event_simulation_microservice.Services.Interfaces;
using StackExchange.Redis;

namespace airo_event_simulation_microservice.Services.Impl;

public class RedisCache(IConnectionMultiplexer connection) : IRedisCache
{
    private readonly IDatabase _database = connection.GetDatabase();

    public async Task StoreDllAsync(string key, byte[] dllData)
    {
        await _database.StringSetAsync(key, dllData);
    }

    public async Task<byte[]?> GetDllAsync(string key)
    {
        var entry = await _database.StringGetAsync(key);
        return entry.IsNull ? default : entry;
    }
}
