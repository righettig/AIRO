using System.Text.Json.Serialization;

namespace airo_leaderboard_microservice.Common.Services.Impl;

public class EventCompletedMessage
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }

    [JsonPropertyName("winnerUserId")]
    public required string WinnerUserId { get; set; }
}