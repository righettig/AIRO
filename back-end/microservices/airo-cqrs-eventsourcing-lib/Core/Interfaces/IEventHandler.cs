namespace airo_cqrs_eventsourcing_lib.Core.Interfaces;

public interface IEventHandler<TEvent>
{
    public void Handle(TEvent @event);
}
