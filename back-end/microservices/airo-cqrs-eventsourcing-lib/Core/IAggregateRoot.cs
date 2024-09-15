namespace airo_cqrs_eventsourcing_lib.Core;

public interface IAggregateRoot
{
    Guid Id { get; init; }
    IReadOnlyList<IEvent> GetUncommittedEvents();
    void MarkEventsAsCommitted();
    void LoadFromHistory(IEnumerable<IEvent> events);
}
