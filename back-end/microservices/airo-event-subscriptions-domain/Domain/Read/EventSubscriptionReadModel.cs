using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_event_subscriptions_domain.Domain.Read;

public class EventSubscriptionReadModel : IReadModel
{
    public Guid EventId { get; set; }
    public List<(string, SubscriptionData)> Participants { get; set; } = [];

    public override string? ToString()
    {
        return $"EventId: {EventId}, Participants: {Participants.Select(x => x.Item1)}";
    }
}