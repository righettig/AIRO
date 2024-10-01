namespace airo_event_subscriptions_microservice.DTOs;

public record SubscribeToEventRequest(string UserId, Guid EventId, Guid BotId);
