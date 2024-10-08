namespace airo_events_microservice.Services.Interfaces;

public interface IRabbitMQPublisherService
{
    void OnEventCreated(Guid eventId, DateTime scheduledAt);
}