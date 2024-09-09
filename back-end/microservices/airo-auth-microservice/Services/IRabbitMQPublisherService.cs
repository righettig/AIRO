namespace airo_auth_microservice.Services;

public interface IRabbitMQPublisherService
{
    void PublishUserCreatedEvent(string message);
}