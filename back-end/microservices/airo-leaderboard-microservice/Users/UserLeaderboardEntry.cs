using airo_leaderboard_microservice.Common.Data.Interfaces;

namespace airo_leaderboard_microservice.Users;

public class UserLeaderboardEntry : ILeaderboardEntry
{
    public string Id { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public int TotalEvents { get; set; }
}
