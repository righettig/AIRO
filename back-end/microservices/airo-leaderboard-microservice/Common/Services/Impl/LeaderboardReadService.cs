using airo_leaderboard_microservice.Common.Data.Interfaces;
using airo_leaderboard_microservice.Common.Services.Interfaces;

namespace airo_leaderboard_microservice.Common.Services.Impl;

public class LeaderboardReadService<T>(IRedisCache<T> redisCache) : ILeaderboardReadService<T> 
    where T : class, ILeaderboardEntry
{
    public async Task<T> GetByIdAsync(string id)
    {
        var result = await redisCache.GetEntryAsync(id);
        return result;
    }

    public async Task<List<T>> GetTopNAsync(int n)
    {
        var result = await redisCache.GetTopNEntriesAsync(n);
        return result;
    }
}
