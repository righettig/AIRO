using airo_leaderboard_microservice.Common.Data.Interfaces;
using airo_leaderboard_microservice.Common.Services.Interfaces;

namespace airo_leaderboard_microservice.Common.Services.Impl.InMemory;

public class InMemoryLeaderboardReadService<T>(InMemoryLeaderboardRepository<T> repository) : ILeaderboardReadService<T>
    where T : class, ILeaderboardEntry, new()
{
    public Task<T?> GetByIdAsync(string id)
    {
        repository.Entries.TryGetValue(id, out var entry);
        return Task.FromResult(entry);
    }

    public Task<List<T>> GetTopNAsync(int n)
    {
        var topEntries = repository.Entries.Values
            .OrderByDescending(e => e.Wins) // Sort by wins, you can customize the sorting logic
            .ThenBy(e => e.Losses)          // Sort by losses as a secondary criterion
            .Take(n)
            .ToList();

        return Task.FromResult(topEntries);
    }
}
