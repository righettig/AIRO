using airo_cqrs_eventsourcing_lib.Core;

namespace airo_cqrs_eventsourcing_lib.Impl;

public abstract class EventHandlerBase<TEvent, TReadModel>(IReadRepository<TReadModel> readRepository)
    where TEvent : IEvent
    where TReadModel : class
{
    protected IReadRepository<TReadModel> readRepository = readRepository;

    public abstract void Handle(TEvent @event);
}