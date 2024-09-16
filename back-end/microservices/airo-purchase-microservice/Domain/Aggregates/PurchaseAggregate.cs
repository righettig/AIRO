using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;
using airo_purchase_microservice.Domain.Write.Events;

namespace airo_purchase_microservice.Domain.Aggregates;

public class PurchaseAggregate : AggregateRoot, IAggregateRoot
{
    public void PurchaseBot(Guid userId, Guid botId)
    {
        RaiseEvent(new BotPurchasedEvent(userId, botId));
    }

    private void Apply(BotPurchasedEvent @event)
    {
    }
}
