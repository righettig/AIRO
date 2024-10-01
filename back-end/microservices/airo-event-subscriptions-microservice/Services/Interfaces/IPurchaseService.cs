namespace airo_event_subscriptions_microservice.Services.Interfaces;

public interface IPurchaseService
{
    Task<bool> OwnsBot(string userId, Guid botId);
}
