namespace airo_cqrs_eventsourcing_lib.Core.Interfaces;

public interface IAggregateRoot
{
    Guid Id { get; init; }
    IReadOnlyList<IEvent> GetUncommittedEvents();
    void MarkEventsAsCommitted();
    void LoadFromHistory(IEnumerable<IEvent> events);
}
