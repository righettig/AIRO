using airo_cqrs_eventsourcing_lib.Impl;

namespace airo_cqrs_eventsourcing_lib.Core;

public interface IEventStore
{
    event EventStore.EventsAddedHandler OnEventsAdded;

    void AddEvents(Guid aggregateId, IEnumerable<IEvent> events);
    void DumpEvents();
    IEnumerable<IEvent> GetEvents(Guid aggregateId);
}