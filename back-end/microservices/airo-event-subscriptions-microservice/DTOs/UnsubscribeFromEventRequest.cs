namespace airo_event_subscriptions_microservice.DTOs;

public record UnsubscribeFromEventRequest(Guid UserId, Guid EventId);
