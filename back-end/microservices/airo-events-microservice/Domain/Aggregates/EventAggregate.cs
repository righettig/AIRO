using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;
using airo_events_microservice.Domain.Write.Events;

namespace airo_events_microservice.Domain.Aggregates;

public class EventAggregate : AggregateRoot, IAggregateRoot
{
    public void CreateEvent(Guid id, string name, string description)
    {
        RaiseEvent(new EventCreatedEvent(id, name, description));
    }

    public void DeleteEvent(Guid id)
    {
        RaiseEvent(new EventDeletedEvent(id));
    }

    public void UpdateEvent(Guid id, string name, string description)
    {
        RaiseEvent(new EventUpdatedEvent(id, name, description));
    }

    private void Apply(EventCreatedEvent @event)
    {
    }

    private void Apply(EventUpdatedEvent @event)
    {
    }

    private void Apply(EventDeletedEvent @event)
    {
    }
}
