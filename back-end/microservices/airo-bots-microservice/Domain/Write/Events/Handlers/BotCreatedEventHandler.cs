using airo_bots_microservice.Domain.Read;
using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;

namespace airo_bots_microservice.Domain.Write.Events.Handlers;

public class BotCreatedEventHandler(IReadRepository<BotReadModel> readRepository) :
    EventHandlerBase<BotCreatedEvent, BotReadModel>(readRepository), IEventHandler<BotCreatedEvent>
{
    public override void Handle(BotCreatedEvent @event)
    {
        readRepository.Add(new BotReadModel { Id = @event.Id, Name = @event.Name, Price = @event.Price });
        readRepository.SaveChanges();
    }
}