using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_events_microservice.Domain.Aggregates;
using airo_events_microservice.Domain.Read;

namespace airo_events_microservice.Domain.Write.Events.Handlers;

public class EventStartedEventHandler(IReadRepository<EventReadModel> readRepository) :
    EventHandlerBase<EventStartedEvent, EventReadModel>(readRepository), IEventHandler<EventStartedEvent>
{
    public override void Handle(EventStartedEvent @event)
    {
        var model = readRepository.GetById(@event.Id);
        model.Status = nameof(EventStatus.Started);

        readRepository.Update(model);
        readRepository.SaveChanges();
    }
}
