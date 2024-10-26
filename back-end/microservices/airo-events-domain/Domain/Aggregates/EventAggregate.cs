using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_events_microservice.Domain.Write.Events;

namespace airo_events_microservice.Domain.Aggregates;

public enum EventStatus 
{
    NotStarted,
    Started,
    Completed
}

public class EventAggregate : AggregateRoot, IAggregateRoot
{
    private EventStatus _status;

    public void CreateEvent(Guid id, string name, string description, DateTime scheduledAt, Guid mapId)
    {
        RaiseEvent(new EventCreatedEvent(id, name, description, scheduledAt, mapId));
    }

    public void DeleteEvent(Guid id)
    {
        RaiseEvent(new EventDeletedEvent(id));
    }

    public void UpdateEvent(Guid id, string name, string description, DateTime scheduledAt, Guid mapId)
    {
        RaiseEvent(new EventUpdatedEvent(id, name, description, scheduledAt, mapId));
    }
    
    public void StartEvent(Guid id)
    {
        if (_status == EventStatus.Started) 
        {
            throw new InvalidOperationException("Cannot start an event multiple times.");
        }

        if (_status == EventStatus.Completed)
        {
            throw new InvalidOperationException("Cannot start a completed event.");
        }

        RaiseEvent(new EventStartedEvent(id));
    }

    public void CompletedEvent(Guid id, string winnerUserId)
    {
        if (_status == EventStatus.NotStarted)
        {
            throw new InvalidOperationException("Cannot stop an event which has not started yet.");
        }

        if (_status == EventStatus.Completed)
        {
            throw new InvalidOperationException("Cannot complete an event multiple times.");
        }

        RaiseEvent(new EventCompletedEvent(id, winnerUserId));
    }

    private void Apply(EventCreatedEvent @event)
    {
        _status = EventStatus.NotStarted;
    }

    private void Apply(EventUpdatedEvent @event)
    {
    }

    private void Apply(EventDeletedEvent @event)
    {
    }

    private void Apply(EventStartedEvent @event)
    {
        _status = EventStatus.Started;
    }

    private void Apply(EventCompletedEvent @event)
    {
        _status = EventStatus.Completed;
    }
}
