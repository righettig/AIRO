using airo_leaderboard_microservice.Common.Data.Interfaces;

namespace airo_leaderboard_tests;

public class LeaderboardEntry : ILeaderboardEntry
{
    public string Id { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public int TotalEvents { get; set; }
}