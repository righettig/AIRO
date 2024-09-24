using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_purchase_microservice.Domain.Write.Events;

public class BotPurchasedEvent(Guid userId, Guid botId) : Event
{
    public Guid UserId { get; } = userId;
    public Guid BotId { get; } = botId;
}
