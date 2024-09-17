namespace airo_cqrs_eventsourcing_lib.Core;

public interface IEventListener
{
    void Bind<TEvent, THandler>() where THandler : IEventHandler<TEvent>;
}