using airo_leaderboard_microservice.Common.Data.Interfaces;
using System.Collections.Concurrent;

namespace airo_leaderboard_microservice.Common.Services.Impl.InMemory;

public class InMemoryLeaderboardRepository<T> where T : class, ILeaderboardEntry, new()
{
    public ConcurrentDictionary<string, T> Entries { get; } = new();
}