using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_event_subscriptions_domain.Domain.Write.Events;

public class EventSubscribedEvent(string userId, Guid eventId, Guid botId, Guid botBehaviourId) : Event
{
    public string UserId { get; } = userId;
    public Guid EventId { get; } = eventId;
    public Guid BotId { get; } = botId;
    public Guid BotBehaviourId { get; } = botBehaviourId;
}
