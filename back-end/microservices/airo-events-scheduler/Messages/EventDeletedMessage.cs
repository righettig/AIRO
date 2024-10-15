using System.Text.Json.Serialization;

namespace airo_events_scheduler.Messages;

public class EventDeletedMessage
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }
}