namespace airo_leaderboard_microservice.Common.Models;

public class EventSubscriptionDto
{
    public required string UserId { get; set; }
    public Guid BotId { get; set; }
    public Guid BotBehaviourId { get; set; }
}
