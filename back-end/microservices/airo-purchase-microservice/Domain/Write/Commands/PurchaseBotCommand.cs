using airo_cqrs_eventsourcing_lib.Core;

namespace airo_purchase_microservice.Domain.Write.Commands;

public class PurchaseBotCommand(Guid userId, Guid botId) : ICommand
{
    public Guid UserId { get; } = userId;
    public Guid BotId { get; } = botId;
}