namespace airo_event_subscriptions_microservice.DTOs;

public record SubscribeToEventRequest(Guid UserId, Guid EventId, Guid BotId);
