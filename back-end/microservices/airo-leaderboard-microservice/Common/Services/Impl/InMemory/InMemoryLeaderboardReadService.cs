using airo_leaderboard_microservice.Common.Data.Interfaces;
using airo_leaderboard_microservice.Common.Services.Interfaces;
using System.Collections.Concurrent;

namespace airo_leaderboard_microservice.Common.Services.Impl.InMemory;

public class InMemoryLeaderboardReadService<T> : ILeaderboardReadService<T>
    where T : class, ILeaderboardEntry, new()
{
    private readonly ConcurrentDictionary<string, T> _entries = new();

    public Task<T?> GetByIdAsync(string id)
    {
        _entries.TryGetValue(id, out var entry);
        return Task.FromResult(entry);
    }

    public Task<List<T>> GetTopNAsync(int n)
    {
        var topEntries = _entries.Values
            .OrderByDescending(e => e.Wins) // Sort by wins, you can customize the sorting logic
            .ThenBy(e => e.Losses)          // Sort by losses as a secondary criterion
            .Take(n)
            .ToList();

        return Task.FromResult(topEntries);
    }
}
