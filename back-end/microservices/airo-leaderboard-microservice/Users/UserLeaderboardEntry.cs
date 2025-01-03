﻿using airo_leaderboard_microservice.Common.Data.Interfaces;
using Newtonsoft.Json;

namespace airo_leaderboard_microservice.Users;

public class UserLeaderboardEntry : ILeaderboardEntry
{
    [JsonProperty("id")]
    public string Id { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public int TotalEvents { get; set; }
}
