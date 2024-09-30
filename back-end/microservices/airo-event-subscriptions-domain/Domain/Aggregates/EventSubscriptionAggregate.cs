using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_event_subscriptions_domain.Domain.Write.Events;

namespace airo_event_subscriptions_domain.Domain.Aggregates;

public class EventSubscriptionAggregate : AggregateRoot, IAggregateRoot
{
    private readonly Dictionary<Guid, Dictionary<Guid, Guid>> subscriptions = [];

    public void SubscribeToEvent(Guid userId, Guid eventId, Guid botId)
    {
        if (subscriptions[eventId].ContainsKey(userId)) 
        {
            throw new InvalidOperationException("The user is already subscribed to the event.");
        }

        RaiseEvent(new EventSubscribedEvent(userId, eventId, botId));
    }

    public void UnsubscribeFromEvent(Guid userId, Guid eventId)
    {
        if (!subscriptions[eventId].ContainsKey(userId))
        {
            throw new InvalidOperationException("The user is subscribed to the event.");
        }

        RaiseEvent(new EventUnsubscribedEvent(userId, eventId));
    }

    private void Apply(EventSubscribedEvent @event)
    {
        if (!subscriptions.ContainsKey(@event.EventId)) 
        {
            subscriptions.Add(@event.EventId, []);
        }

        subscriptions[@event.EventId][@event.UserId] = @event.BotId;
    }

    private void Apply(EventUnsubscribedEvent @event)
    {
        subscriptions[@event.EventId].Remove(@event.UserId);
    }
}
