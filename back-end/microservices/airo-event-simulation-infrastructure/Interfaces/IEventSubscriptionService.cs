namespace airo_event_simulation_infrastructure.Interfaces;

public interface IEventSubscriptionService
{
    Task<(string, Guid)[]> GetParticipants(Guid eventId);
}
