using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_event_subscriptions_domain.Domain.Read;

namespace airo_event_subscriptions_domain.Domain.Write.Events.Handlers;

public class EventUnsubscribedEventHandler(IReadRepository<EventSubscriptionReadModel> readRepository) :
    EventHandlerBase<EventUnsubscribedEvent, EventSubscriptionReadModel>(readRepository), IEventHandler<EventUnsubscribedEvent>
{
    public override void Handle(EventUnsubscribedEvent @event)
    {
        var model = readRepository.GetById(@event.EventId);

        model.Participants.RemoveAll(x => x.Item1 == @event.UserId);

        readRepository.SaveChanges();
    }
}