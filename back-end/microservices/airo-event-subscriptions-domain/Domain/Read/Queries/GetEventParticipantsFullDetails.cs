using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_event_subscriptions_domain.Domain.Read.Queries;

public class EventSubscriptionDto
{
    public string UserId { get; set; }
    public Guid BotId { get; set; }
    public Guid BotBehaviourId { get; set; }
}

public record GetEventParticipantsFullDetails(Guid EventId) : IQuery<EventSubscriptionDto[]>;
