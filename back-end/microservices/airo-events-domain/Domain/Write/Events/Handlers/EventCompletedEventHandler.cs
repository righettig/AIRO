using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_events_microservice.Domain.Aggregates;
using airo_events_microservice.Domain.Read;

namespace airo_events_microservice.Domain.Write.Events.Handlers;

public class EventCompletedEventHandler(IReadRepository<EventReadModel> readRepository) :
    EventHandlerBase<EventCompletedEvent, EventReadModel>(readRepository), IEventHandler<EventCompletedEvent>
{
    public override void Handle(EventCompletedEvent @event)
    {
        var model = readRepository.GetById(@event.Id);
        model.Status = nameof(EventStatus.Completed);
        model.WinnerUserId = @event.WinnerUserId;

        readRepository.Update(model);
        readRepository.SaveChanges();
    }
}