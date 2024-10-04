using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_events_microservice.Domain.Write.Commands;

public class StartEventCommand(Guid id) : ICommand
{
    public Guid Id { get; } = id;
}
