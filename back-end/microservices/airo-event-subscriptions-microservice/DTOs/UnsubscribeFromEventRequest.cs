namespace airo_event_subscriptions_microservice.DTOs;

public record UnsubscribeFromEventRequest(string UserId, Guid EventId);
