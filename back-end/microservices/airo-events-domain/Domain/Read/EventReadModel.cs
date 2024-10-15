using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_events_microservice.Domain.Read;

public class EventReadModel : IReadModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string Status { get; set; }
    public string? WinnerUserId { get; set; }

    public override string? ToString()
    {
        return $"Id: {Id}, Name: {Name}, Description {Description}, CreatedAt {CreatedAt}, ScheduledAt {ScheduledAt}, Status {Status}, WinnerUserId {WinnerUserId}";
    }
}