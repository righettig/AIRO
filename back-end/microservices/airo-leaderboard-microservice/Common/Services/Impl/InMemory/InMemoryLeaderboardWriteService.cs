using airo_leaderboard_microservice.Common.Data.Interfaces;
using airo_leaderboard_microservice.Common.Services.Interfaces;
using System.Collections.Concurrent;

namespace airo_leaderboard_microservice.Common.Services.Impl.InMemory;

public class InMemoryLeaderboardWriteService<T> : ILeaderboardWriteService<T>
    where T : class, ILeaderboardEntry, new()
{
    private readonly ConcurrentDictionary<string, T> _entries = new();

    public Task MarkAsLoser(string id)
    {
        var entry = _entries.GetOrAdd(id, _ => new T { Id = id });
        entry.TotalEvents += 1;
        entry.Losses += 1;

        Console.WriteLine("Updated in-memory entry as loser: " + id);
        return Task.CompletedTask;
    }

    public Task MarkAsWinner(string id)
    {
        var entry = _entries.GetOrAdd(id, _ => new T { Id = id });
        entry.TotalEvents += 1;
        entry.Wins += 1;

        Console.WriteLine("Updated in-memory entry as winner: " + id);
        return Task.CompletedTask;
    }

    // Method to retrieve the leaderboard entry, useful for testing purposes
    public T GetEntry(string id) => _entries.TryGetValue(id, out var entry) ? entry : null;
}
