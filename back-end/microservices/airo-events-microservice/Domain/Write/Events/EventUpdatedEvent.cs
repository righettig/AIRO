using airo_cqrs_eventsourcing_lib.Core;

namespace airo_events_microservice.Domain.Write.Events;

public class EventUpdatedEvent(Guid id, string name, string description) : IEvent
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public string Description { get; } = description;
}
