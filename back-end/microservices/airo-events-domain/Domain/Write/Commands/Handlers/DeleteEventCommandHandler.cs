﻿using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_events_microservice.Domain.Aggregates;

namespace airo_events_microservice.Domain.Write.Commands.Handlers;

public class DeleteEventCommandHandler(AggregateRepository<EventAggregate> aggregateRepository)
    : CommandHandlerBase<DeleteEventCommand, EventAggregate>(aggregateRepository)
{
    protected override Guid GetAggregateId(DeleteEventCommand command) => command.Id;


    protected override void ProcessCommand(DeleteEventCommand command, EventAggregate aggregate)
    {
        aggregate.DeleteEvent(command.Id);
    }
}