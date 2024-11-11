using airo_bots_microservice.Domain.Read;
using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_bots_microservice.Domain.Write.Events.Handlers;

public class BotCreatedEventHandler(IReadRepository<BotReadModel> readRepository) :
    EventHandlerBase<BotCreatedEvent, BotReadModel>(readRepository), IEventHandler<BotCreatedEvent>
{
    public override void Handle(BotCreatedEvent @event)
    {
        readRepository.Add(new BotReadModel { Id = @event.Id, Name = @event.Name, Price = @event.Price, Health = @event.Health, Attack = @event.Attack, Defense = @event.Defense });
        readRepository.SaveChanges();
    }
}