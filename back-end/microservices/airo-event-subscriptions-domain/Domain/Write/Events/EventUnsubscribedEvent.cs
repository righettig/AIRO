﻿using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_event_subscriptions_domain.Domain.Write.Events;

public class EventUnsubscribedEvent(Guid userId, Guid eventId) : Event
{
    public Guid UserId { get; } = userId;
    public Guid EventId { get; } = eventId;
}
