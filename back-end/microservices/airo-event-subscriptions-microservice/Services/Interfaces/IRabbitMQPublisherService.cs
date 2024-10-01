namespace airo_event_subscriptions_microservice.Services.Interfaces;

public interface IRabbitMQPublisherService
{
    void OnEventSubscribed(string userId, Guid eventId);
    void OnEventUnsubscribed(string userId, Guid eventId);
}