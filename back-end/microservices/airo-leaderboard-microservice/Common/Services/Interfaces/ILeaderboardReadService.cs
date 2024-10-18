namespace airo_leaderboard_microservice.Common.Services.Interfaces;

public interface ILeaderboardReadService<T>
{
    Task<List<T>> GetTopNAsync(int n);
    Task<T?> GetByIdAsync(string id);
}