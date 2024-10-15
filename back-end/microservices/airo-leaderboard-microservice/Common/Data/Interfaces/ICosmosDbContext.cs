namespace airo_leaderboard_microservice.Common.Data.Interfaces;

public interface ICosmosDbContext<T> where T : ILeaderboardEntry
{
    Task CreateOrUpdateEntryAsync(T entry);
    Task<T> GetEntryAsync(string id);
    Task<List<T>> GetTopNEntriesAsync(int n);
}