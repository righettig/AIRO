using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;
using airo_purchase_microservice.Domain.Write.Events;

namespace airo_purchase_microservice.Domain.Aggregates;

public class PurchaseAggregate : AggregateRoot, IAggregateRoot
{
    private readonly List<Guid> purchased = [];

    public void PurchaseBot(Guid userId, Guid botId)
    {
        if (purchased.Contains(botId)) 
        {
            throw new InvalidOperationException("Cannot buy same bot multiple times");
        }

        RaiseEvent(new BotPurchasedEvent(userId, botId));
    }

    private void Apply(BotPurchasedEvent @event)
    {
        purchased.Add(@event.BotId);
    }
}
