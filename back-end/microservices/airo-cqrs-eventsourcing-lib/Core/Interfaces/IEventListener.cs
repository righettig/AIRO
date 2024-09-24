namespace airo_cqrs_eventsourcing_lib.Core.Interfaces;

public interface IEventListener
{
    void Bind<TEvent, THandler>() where THandler : IEventHandler<TEvent>;
    void SubscribeTo(IEventStore eventStore);
    Task ProcessEvents(IEventStore eventStore);
}