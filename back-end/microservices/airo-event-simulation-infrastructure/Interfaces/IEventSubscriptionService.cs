namespace airo_event_simulation_infrastructure.Interfaces;

public class EventSubscriptionDto
{
    public string UserId { get; set; }
    public Guid BotId { get; set; }
    public Guid BotBehaviourId { get; set; }
}

public interface IEventSubscriptionService
{
    Task<EventSubscriptionDto[]> GetParticipants(Guid eventId);
}
