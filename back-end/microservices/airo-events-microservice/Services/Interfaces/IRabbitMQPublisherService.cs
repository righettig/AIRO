namespace airo_events_microservice.Services.Interfaces;

public interface IRabbitMQPublisherService
{
    void OnEventCreated(Guid eventId, DateTime scheduledAt);
    void OnEventUpdated(Guid eventId, DateTime scheduledAt);
    void OnEventDeleted(Guid eventId);
    void OnEventCompleted(Guid eventId, string winnerUserId);
}