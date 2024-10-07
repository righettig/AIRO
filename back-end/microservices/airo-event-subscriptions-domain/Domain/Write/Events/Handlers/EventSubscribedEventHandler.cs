using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_event_subscriptions_domain.Domain.Read;

namespace airo_event_subscriptions_domain.Domain.Write.Events.Handlers;

public class EventSubscribedEventHandler(IReadRepository<EventSubscriptionReadModel> readRepository) :
    EventHandlerBase<EventSubscribedEvent, EventSubscriptionReadModel>(readRepository), IEventHandler<EventSubscribedEvent>
{
    public override void Handle(EventSubscribedEvent @event)
    {
        var model = readRepository.GetById(@event.EventId);

        if (model == null) 
        {
            readRepository.Add(new EventSubscriptionReadModel
            {
                EventId = @event.EventId,
                Participants = [(@event.UserId, new SubscriptionData(@event.BotId, @event.BotBehaviourId))]
            });
        }
        else
        {
            model.Participants.Add(
                (@event.UserId, new SubscriptionData(@event.BotId, @event.BotBehaviourId)));
        }

        readRepository.SaveChanges();
    }
}
