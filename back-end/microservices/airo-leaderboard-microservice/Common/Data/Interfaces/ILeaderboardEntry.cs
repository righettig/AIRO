namespace airo_leaderboard_microservice.Common.Data.Interfaces;

public interface ILeaderboardEntry
{
    string Id { get; set; }
    int Wins { get; set; }
    int Losses { get; set; }
    int TotalEvents { get; set; }
}
