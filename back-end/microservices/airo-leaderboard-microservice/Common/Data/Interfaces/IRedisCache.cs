namespace airo_leaderboard_microservice.Common.Data.Interfaces;

public interface IRedisCache<T> where T : ILeaderboardEntry
{
    Task<T> GetEntryAsync(string id);
    Task<List<T>> GetTopNEntriesAsync(int n);
    Task SetEntryAsync(T entry);
}