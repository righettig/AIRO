using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_events_microservice.Domain.Write.Commands;

public class CreateEventCommand(Guid id, string name, string description) : ICommand
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public string Description { get; } = description;
}