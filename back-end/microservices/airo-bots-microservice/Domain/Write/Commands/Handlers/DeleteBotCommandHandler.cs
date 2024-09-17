using airo_bots_microservice.Domain.Aggregates;
using airo_cqrs_eventsourcing_lib.Impl;

namespace airo_bots_microservice.Domain.Write.Commands.Handlers;

public class DeleteBotCommandHandler(AggregateRepository<BotAggregate> aggregateRepository)
    : CommandHandlerBase<DeleteBotCommand, BotAggregate>(aggregateRepository)
{
    protected override void ProcessCommand(DeleteBotCommand command, BotAggregate aggregate)
    {
        aggregate.DeleteBot(command.Id);
    }

    protected override Guid GetAggregateId(DeleteBotCommand command) => command.Id;
}