﻿using airo_bots_microservice.Domain.Aggregates;
using airo_cqrs_eventsourcing_lib.Impl;

namespace airo_bots_microservice.Domain.Write.Commands.Handlers;

public class CreateBotCommandHandler(AggregateRepository<BotAggregate> aggregateRepository)
    : CommandHandlerBase<CreateBotCommand, BotAggregate>(aggregateRepository)
{
    protected override void ProcessCommand(CreateBotCommand command, BotAggregate aggregate)
    {
        aggregate.CreateBot(command.Id, command.Name, command.Price);
    }
}
