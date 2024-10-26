using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_events_microservice.Domain.Read;

namespace airo_events_microservice.Domain.Write.Events.Handlers;

public class EventUpdatedEventHandler(IReadRepository<EventReadModel> readRepository) :
    EventHandlerBase<EventUpdatedEvent, EventReadModel>(readRepository), IEventHandler<EventUpdatedEvent>
{
    public override void Handle(EventUpdatedEvent @event)
    {
        var entry = readRepository.GetById(@event.Id);

        entry.Name = @event.Name;
        entry.Description = @event.Description;
        entry.ScheduledAt = @event.ScheduledAt;
        entry.MapId = @event.MapId;

        readRepository.Update(entry);
        readRepository.SaveChanges();
    }
}