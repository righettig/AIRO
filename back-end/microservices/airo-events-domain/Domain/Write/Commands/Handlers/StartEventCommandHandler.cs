using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_events_microservice.Domain.Aggregates;

namespace airo_events_microservice.Domain.Write.Commands.Handlers;

public class StartEventCommandHandler(AggregateRepository<EventAggregate> aggregateRepository)
    : CommandHandlerBase<StartEventCommand, EventAggregate>(aggregateRepository)
{
    protected override Guid GetAggregateId(StartEventCommand command) => command.Id;


    protected override void ProcessCommand(StartEventCommand command, EventAggregate aggregate)
    {
        aggregate.StartEvent(command.Id);
    }
}


