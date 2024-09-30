using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_event_subscriptions_domain.Domain.Write.Events;

public class EventSubscribedEvent(Guid userId, Guid eventId, Guid botId) : Event
{
    public Guid UserId { get; } = userId;
    public Guid EventId { get; } = eventId;
    public Guid BotId { get; } = botId;
}
