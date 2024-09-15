using airo_cqrs_eventsourcing_lib.Core;

namespace airo_events_microservice.Domain.Write.Events;

public class EventDeletedEvent(Guid id) : IEvent
{
    public Guid Id { get; } = id;
}
