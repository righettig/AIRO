using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_events_microservice.Domain.Aggregates;

namespace airo_events_microservice.Domain.Write.Commands.Handlers;

public class CompleteEventCommandHandler(AggregateRepository<EventAggregate> aggregateRepository)
    : CommandHandlerBase<CompleteEventCommand, EventAggregate>(aggregateRepository)
{
    protected override Guid GetAggregateId(CompleteEventCommand command) => command.Id;


    protected override void ProcessCommand(CompleteEventCommand command, EventAggregate aggregate)
    {
        aggregate.CompletedEvent(command.Id);
    }
}