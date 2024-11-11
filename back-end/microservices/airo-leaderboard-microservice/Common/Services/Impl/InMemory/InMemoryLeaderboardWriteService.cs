using airo_leaderboard_microservice.Common.Data.Interfaces;
using airo_leaderboard_microservice.Common.Services.Interfaces;

namespace airo_leaderboard_microservice.Common.Services.Impl.InMemory;

public class InMemoryLeaderboardWriteService<T>(InMemoryLeaderboardRepository<T> repository) : ILeaderboardWriteService<T>
    where T : class, ILeaderboardEntry, new()
{
    public Task MarkAsLoser(string id)
    {
        var entry = repository.Entries.GetOrAdd(id, _ => new T { Id = id });
        entry.TotalEvents += 1;
        entry.Losses += 1;

        Console.WriteLine("Updated in-memory entry as loser: " + id);
        return Task.CompletedTask;
    }

    public Task MarkAsWinner(string id)
    {
        var entry = repository.Entries.GetOrAdd(id, _ => new T { Id = id });
        entry.TotalEvents += 1;
        entry.Wins += 1;

        Console.WriteLine("Updated in-memory entry as winner: " + id);
        return Task.CompletedTask;
    }
}
