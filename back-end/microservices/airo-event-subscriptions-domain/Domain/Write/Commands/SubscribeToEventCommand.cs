using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_event_subscriptions_domain.Domain.Write.Commands;

public class SubscribeToEventCommand(string userId, Guid eventId, Guid botId) : ICommand
{
    public string UserId { get; } = userId;
    public Guid EventId { get; } = eventId;
    public Guid BotId { get; } = botId;
}