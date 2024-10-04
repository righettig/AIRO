using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_purchase_microservice.Domain.Read;

public class PurchaseReadModel : IReadModel
{
    public Guid UserId { get; set; }
    public Guid BotId { get; set; }

    public override string? ToString()
    {
        return $"UserId: {UserId}, BotId {BotId}";
    }
}