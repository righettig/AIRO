using airo_cqrs_eventsourcing_lib.Core;

namespace airo_events_microservice.Domain.Read.Queries;

public class GetEventById(Guid EventId) : IQuery<EventReadModel?>
{
    public Guid EventId { get; } = EventId;
}
