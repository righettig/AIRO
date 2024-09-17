using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;
using airo_purchase_microservice.Domain.Read;

namespace airo_purchase_microservice.Domain.Write.Events.Handlers;

public class BotPurchasedEventHandler(IReadRepository<PurchaseReadModel> readRepository) :
    EventHandlerBase<BotPurchasedEvent, PurchaseReadModel>(readRepository), IEventHandler<BotPurchasedEvent>
{
    public override void Handle(BotPurchasedEvent @event)
    {
        readRepository.Add(new PurchaseReadModel { UserId = @event.UserId, BotId = @event.BotId });
        readRepository.SaveChanges();
    }
}