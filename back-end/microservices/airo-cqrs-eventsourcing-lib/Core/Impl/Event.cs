using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_cqrs_eventsourcing_lib.Core.Impl;

public abstract class Event : IEvent
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}