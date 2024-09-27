namespace airo_notification_processor_microservice;

public class TimestampService : ITimestampService
{
    private readonly string filePath = "/data/last_processed_event.txt";

    public void SaveTimestamp(DateTime timestamp)
    {
        File.WriteAllText(filePath, timestamp.ToString("o")); // "o" for ISO 8601 format
    }

    public DateTime LoadTimestamp()
    {
        if (File.Exists(filePath))
        {
            var content = File.ReadAllText(filePath);
            return DateTime.Parse(content);
        }
        return DateTime.MinValue; // or some default value
    }
}
