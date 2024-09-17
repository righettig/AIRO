using airo_cqrs_eventsourcing_lib.Impl;
using airo_purchase_microservice.Domain.Aggregates;

namespace airo_purchase_microservice.Domain.Write.Commands.Handlers;

public class PurchaseBotCommandHandler(AggregateRepository<PurchaseAggregate> aggregateRepository)
    : CommandHandlerBase<PurchaseBotCommand, PurchaseAggregate>(aggregateRepository)
{
    protected override void ProcessCommand(PurchaseBotCommand command, PurchaseAggregate aggregate)
    {
        aggregate.PurchaseBot(command.UserId, command.BotId);
    }

    protected override Guid GetAggregateId(PurchaseBotCommand command) => command.UserId;
}
