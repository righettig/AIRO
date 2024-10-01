namespace airo_event_subscriptions_microservice.Services.Interfaces;

public interface IRabbitMQPublisherService
{
    void OnEventSubscribed(Guid userId, Guid eventId);
    void OnEventUnsubscribed(Guid userId, Guid eventId);
}