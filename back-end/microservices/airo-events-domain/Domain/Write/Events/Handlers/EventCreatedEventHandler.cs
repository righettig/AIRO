using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_events_microservice.Domain.Read;

namespace airo_events_microservice.Domain.Write.Events.Handlers;

public class EventCreatedEventHandler(IReadRepository<EventReadModel> readRepository) :
    EventHandlerBase<EventCreatedEvent, EventReadModel>(readRepository), IEventHandler<EventCreatedEvent>
{
    public override void Handle(EventCreatedEvent @event)
    {
        readRepository.Add(new EventReadModel { Id = @event.Id, Name = @event.Name, Description = @event.Description });
        readRepository.SaveChanges();
    }
}