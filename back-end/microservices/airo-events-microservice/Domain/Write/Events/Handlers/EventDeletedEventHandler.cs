using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;
using airo_events_microservice.Domain.Read;

namespace airo_events_microservice.Domain.Write.Events.Handlers;

public class EventDeletedEventHandler(IReadRepository<EventReadModel> readRepository) :
    EventHandlerBase<EventDeletedEvent, EventReadModel>(readRepository), IEventHandler<EventDeletedEvent>
{
    public override void Handle(EventDeletedEvent @event)
    {
        readRepository.Remove(@event.Id);
        readRepository.SaveChanges();
    }
}