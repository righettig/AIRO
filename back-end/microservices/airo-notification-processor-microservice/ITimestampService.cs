
namespace airo_notification_processor_microservice
{
    public interface ITimestampService
    {
        DateTime LoadTimestamp();
        void SaveTimestamp(DateTime timestamp);
    }
}