using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_events_microservice.Domain.Write.Events;

public class EventUpdatedEvent(Guid id, string name, string description, DateTime scheduledAt, Guid mapId) : Event
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public string Description { get; } = description;
    public DateTime ScheduledAt { get; } = scheduledAt;
    public Guid MapId { get; } = mapId;
}
