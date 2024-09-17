namespace airo_purchase_microservice.Domain.Read;

public class PurchaseReadModel
{
    public Guid UserId { get; set; }
    public Guid BotId { get; set; }

    public override string? ToString()
    {
        return $"UserId: {UserId}, BotId {BotId}";
    }
}