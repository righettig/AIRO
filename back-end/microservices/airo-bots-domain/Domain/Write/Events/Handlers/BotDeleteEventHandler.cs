using airo_bots_microservice.Domain.Read;
using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_bots_microservice.Domain.Write.Events.Handlers;

public class BotDeleteEventHandler(IReadRepository<BotReadModel> readRepository) :
    EventHandlerBase<BotDeletedEvent, BotReadModel>(readRepository), IEventHandler<BotDeletedEvent>
{
    public override void Handle(BotDeletedEvent @event)
    {
        readRepository.Remove(@event.Id);
        readRepository.SaveChanges();
    }
}