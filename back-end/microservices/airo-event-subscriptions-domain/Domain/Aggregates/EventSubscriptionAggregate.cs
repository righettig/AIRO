using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_event_subscriptions_domain.Domain.Write.Events;

namespace airo_event_subscriptions_domain.Domain.Aggregates;

public class EventSubscriptionAggregate : AggregateRoot, IAggregateRoot
{
    private readonly Dictionary<Guid, HashSet<string>> subscriptions = [];

    public void SubscribeToEvent(string userId, Guid eventId, Guid botId, Guid botBehaviourId)
    {
        if (!subscriptions.TryGetValue(eventId, out HashSet<string>? value)) 
        {
            value = ([]);
            subscriptions.Add(eventId, value);
        }

        if (value.Contains(userId)) 
        {
            throw new InvalidOperationException("The user is already subscribed to the event.");
        }

        RaiseEvent(new EventSubscribedEvent(userId, eventId, botId, botBehaviourId));
    }

    public void UnsubscribeFromEvent(string userId, Guid eventId)
    {
        if (!subscriptions.TryGetValue(eventId, out HashSet<string>? value)) 
        {
            throw new InvalidOperationException("The event has no subscribers.");
        }

        if (!value.Contains(userId))
        {
            throw new InvalidOperationException("The user is not subscribed to the event.");
        }

        RaiseEvent(new EventUnsubscribedEvent(userId, eventId));
    }

    private void Apply(EventSubscribedEvent @event)
    {
        if (!subscriptions.ContainsKey(@event.EventId)) 
        {
            subscriptions.Add(@event.EventId, []);
        }

        subscriptions[@event.EventId].Add(@event.UserId);
    }

    private void Apply(EventUnsubscribedEvent @event)
    {
        subscriptions[@event.EventId].Remove(@event.UserId);
    }
}
