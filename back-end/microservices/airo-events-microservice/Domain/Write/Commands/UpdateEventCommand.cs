using airo_cqrs_eventsourcing_lib.Core;

namespace airo_events_microservice.Domain.Write.Commands;

public class UpdateEventCommand(Guid id, string name, string description) : ICommand
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public string Description { get; } = description;
}