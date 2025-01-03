﻿using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_events_microservice.Domain.Aggregates;

namespace airo_events_microservice.Domain.Write.Commands.Handlers;

public class UpdateEventCommandHandler(AggregateRepository<EventAggregate> aggregateRepository)
    : CommandHandlerBase<UpdateEventCommand, EventAggregate>(aggregateRepository)
{
    protected override Guid GetAggregateId(UpdateEventCommand command) => command.Id;

    protected override void ProcessCommand(UpdateEventCommand command, EventAggregate aggregate)
    {
        aggregate.UpdateEvent(command.Id,
                              command.Name,
                              command.Description,
                              command.ScheduledAt,
                              command.MapId);
    }
}
