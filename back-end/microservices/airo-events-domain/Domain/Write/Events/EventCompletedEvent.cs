using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_events_microservice.Domain.Write.Events;

public class EventCompletedEvent(Guid id) : Event
{
    public Guid Id { get; } = id;
}
