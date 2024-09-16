namespace airo_purchase_microservice.Domain.Read;

public class PurchaseReadModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid BotId { get; set; }

    public override string? ToString()
    {
        return $"Id: {Id}, UserId: {UserId}, BotId {BotId}";
    }
}