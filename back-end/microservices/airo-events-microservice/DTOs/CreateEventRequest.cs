namespace airo_events_microservice.DTOs;

public record CreateEventRequest(string Name, string Description, DateTime ScheduledAt);
