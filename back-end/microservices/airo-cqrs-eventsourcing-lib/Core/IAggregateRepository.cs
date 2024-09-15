namespace airo_cqrs_eventsourcing_lib.Core;

public interface IAggregateRepository<TAggregate> where TAggregate : IAggregateRoot
{
    TAggregate GetById(Guid id);
    void Save(TAggregate aggregate);
}