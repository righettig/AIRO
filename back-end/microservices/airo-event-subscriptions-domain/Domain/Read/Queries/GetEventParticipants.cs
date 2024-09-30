using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_event_subscriptions_domain.Domain.Read.Queries;

public class GetEventParticipants() : IQuery<Guid[]>
{
    public Guid EventId { get; set; }
}