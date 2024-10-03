using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_event_subscriptions_domain.Domain.Aggregates;

namespace airo_event_subscriptions_domain.Domain.Write.Commands.Handlers;

public class SubscribeToEventCommandHandler(AggregateRepository<EventSubscriptionAggregate> aggregateRepository)
    : CommandHandlerBase<SubscribeToEventCommand, EventSubscriptionAggregate>(aggregateRepository)
{
    protected override void ProcessCommand(SubscribeToEventCommand command, EventSubscriptionAggregate aggregate)
    {
        aggregate.SubscribeToEvent(command.UserId, command.EventId, command.BotId);
    }

    protected override Guid GetAggregateId(SubscribeToEventCommand command) => command.EventId;
}
