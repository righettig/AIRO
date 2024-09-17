using airo_bots_microservice.Domain.Read;
using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;

namespace airo_bots_microservice.Domain.Write.Events.Handlers;

public class BotUpdatedEventHandler(IReadRepository<BotReadModel> readRepository) :
    EventHandlerBase<BotUpdatedEvent, BotReadModel>(readRepository), IEventHandler<BotUpdatedEvent>
{
    public override void Handle(BotUpdatedEvent @event)
    {
        readRepository.Update(new BotReadModel { Id = @event.Id, Name = @event.Name, Price = @event.Price });
        readRepository.SaveChanges();
    }
}