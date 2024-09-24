namespace airo_cqrs_eventsourcing_lib.Core.Interfaces;

public interface IAggregateRepository<TAggregate> where TAggregate : IAggregateRoot
{
    Task<TAggregate> GetById(Guid id);
    void Save(TAggregate aggregate);
}