using airo_events_scheduler.Services.Impl;

namespace airo_events_scheduler.Services.Interfaces
{
    public interface IRabbitMQConsumerService
    {
        event EventCreatedHandler EventCreatedReceived;
        event EventDeletedHandler EventDeletedReceived;
        void StartListening();
        void StopListening();
    }
}