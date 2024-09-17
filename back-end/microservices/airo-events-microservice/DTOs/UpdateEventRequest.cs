namespace airo_events_microservice.DTOs;

public record UpdateEventRequest(Guid Id, string Name, string Description);
