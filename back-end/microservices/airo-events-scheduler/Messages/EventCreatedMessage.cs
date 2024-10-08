﻿using System.Text.Json.Serialization;

namespace airo_events_scheduler.Messages;

public class EventCreatedMessage
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }

    [JsonPropertyName("scheduledAt")]
    public DateTime ScheduledAt { get; set; }
}