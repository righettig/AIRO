﻿namespace airo_cqrs_eventsourcing_lib.Core;

public interface IAggregateRepository<TAggregate> where TAggregate : IAggregateRoot
{
    void Add(TAggregate aggregate);
    void AddEvents(Guid id, IReadOnlyList<IEvent> events);
    TAggregate FindById(Guid id);
    void Remove(Guid id);
}