using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_event_subscriptions_domain.Domain.Write.Commands;

public class UnsubscribeFromEventCommand(Guid userId, Guid eventId) : ICommand
{
    public Guid UserId { get; } = userId;
    public Guid EventId { get; } = eventId;
}