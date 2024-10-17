namespace airo_auth_microservice.Services.Interfaces;

public interface IRabbitMQPublisherService
{
    void PublishUserCreatedEvent(string message);
}