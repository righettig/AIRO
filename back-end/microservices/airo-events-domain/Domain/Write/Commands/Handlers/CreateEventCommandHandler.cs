using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_events_microservice.Domain.Aggregates;

namespace airo_events_microservice.Domain.Write.Commands.Handlers;

public class CreateEventCommandHandler(AggregateRepository<EventAggregate> aggregateRepository)
    : CommandHandlerBase<CreateEventCommand, EventAggregate>(aggregateRepository)
{
    protected override Guid GetAggregateId(CreateEventCommand command) => command.Id;

    protected override void ProcessCommand(CreateEventCommand command, EventAggregate aggregate)
    {
        aggregate.CreateEvent(command.Id, command.Name, command.Description, command.ScheduledAt);
    }
}
