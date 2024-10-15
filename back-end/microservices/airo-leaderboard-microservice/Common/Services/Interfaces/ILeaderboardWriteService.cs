using airo_leaderboard_microservice.Common.Data.Interfaces;

namespace airo_leaderboard_microservice.Common.Services.Interfaces;

public interface ILeaderboardWriteService<T> where T : class, ILeaderboardEntry
{
    Task MarkAsWinner(string id);
    Task MarkAsLoser(string id);
}