﻿using airo_bots_microservice.Domain.Aggregates;
using airo_cqrs_eventsourcing_lib.Impl;

namespace airo_bots_microservice.Domain.Write.Commands.Handlers;

public class UpdateBotCommandHandler(AggregateRepository<BotAggregate> aggregateRepository)
    : CommandHandlerBase<UpdateBotCommand, BotAggregate>(aggregateRepository)
{
    protected override void ProcessCommand(UpdateBotCommand command, BotAggregate aggregate)
    {
        aggregate.UpdateBot(command.Id, command.Name, command.Price);
    }
}