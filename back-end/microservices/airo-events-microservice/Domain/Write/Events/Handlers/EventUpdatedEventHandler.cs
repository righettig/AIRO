using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_events_microservice.Domain.Read;

namespace airo_events_microservice.Domain.Write.Events.Handlers;

public class EventUpdatedEventHandler(IReadRepository<EventReadModel> readRepository) :
    EventHandlerBase<EventUpdatedEvent, EventReadModel>(readRepository), IEventHandler<EventUpdatedEvent>
{
    public override void Handle(EventUpdatedEvent @event)
    {
        readRepository.Update(new EventReadModel { Id = @event.Id, Name = @event.Name, Description = @event.Description });
        readRepository.SaveChanges();
    }
}