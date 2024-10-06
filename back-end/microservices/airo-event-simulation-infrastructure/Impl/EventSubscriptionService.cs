using airo_event_simulation_infrastructure.Interfaces;

namespace airo_event_simulation_infrastructure.Impl;

public class EventSubscriptionService : IEventSubscriptionService
{
    public Task<(string, Guid)[]> GetParticipants(Guid eventId)
    {
        var participants = new List<(string, Guid)>
        {
            ("uid1", Guid.NewGuid()),
            ("uid2", Guid.NewGuid())
        };

        return Task.FromResult(participants.ToArray());
    }
}
