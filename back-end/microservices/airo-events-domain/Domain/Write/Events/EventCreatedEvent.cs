using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_events_microservice.Domain.Write.Events;

public class EventCreatedEvent(Guid id, string name, string description) : Event
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public string Description { get; } = description;
}
