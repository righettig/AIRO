﻿namespace airo_event_subscriptions_domain.Domain.Read;

public class EventSubscriptionReadModel
{
    public Guid EventId { get; set; }
    public List<(string, Guid)> Participants { get; set; } = [];

    public override string? ToString()
    {
        return $"EventId: {EventId}, Participants: {Participants.Select(x => x.Item1)}";
    }
}