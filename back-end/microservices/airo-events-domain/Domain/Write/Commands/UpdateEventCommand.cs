using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_events_microservice.Domain.Write.Commands;

public class UpdateEventCommand(Guid id,
                                string name,
                                string description,
                                DateTime scheduledAt,
                                Guid mapId) : ICommand
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public string Description { get; } = description;
    public DateTime ScheduledAt { get; } = scheduledAt;
    public Guid MapId { get; } = mapId;
}