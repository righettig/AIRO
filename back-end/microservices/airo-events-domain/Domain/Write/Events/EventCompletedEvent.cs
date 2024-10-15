using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_events_microservice.Domain.Write.Events;

public class EventCompletedEvent(Guid id, string winnerUserId) : Event
{
    public Guid Id { get; } = id;
    public string WinnerUserId { get; } = winnerUserId;
}
