using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_events_microservice.Domain.Write.Commands;

public class DeleteEventCommand(Guid id) : ICommand
{
    public Guid Id { get; } = id;
}