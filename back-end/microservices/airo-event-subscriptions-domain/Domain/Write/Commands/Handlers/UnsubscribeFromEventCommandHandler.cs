using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_event_subscriptions_domain.Domain.Aggregates;

namespace airo_event_subscriptions_domain.Domain.Write.Commands.Handlers;

public class UnsubscribeFromEventCommandHandler(AggregateRepository<EventSubscriptionAggregate> aggregateRepository)
    : CommandHandlerBase<UnsubscribeFromEventCommand, EventSubscriptionAggregate>(aggregateRepository)
{
    protected override void ProcessCommand(UnsubscribeFromEventCommand command, EventSubscriptionAggregate aggregate)
    {
        aggregate.UnsubscribeFromEvent(command.EventId, command.UserId, command.BotId);
    }

    protected override Guid GetAggregateId(UnsubscribeFromEventCommand command) => command.EventId;
}