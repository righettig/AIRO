using airo_cqrs_eventsourcing_lib.Core;

namespace airo_purchase_microservice.Domain.Write.Events;

public class BotPurchasedEvent(Guid userId, Guid botId) : IEvent
{
    public Guid UserId { get; } = userId;
    public Guid BotId { get; } = botId;
}
