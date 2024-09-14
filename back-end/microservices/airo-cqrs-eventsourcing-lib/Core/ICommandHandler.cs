namespace airo_cqrs_eventsourcing_lib.Core;

public interface ICommandHandler<TCommand>
{
    public void Handle(TCommand command);
}