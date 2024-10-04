namespace airo_events_microservice.Domain.Read;

public class EventReadModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; }

    public override string? ToString()
    {
        return $"Id: {Id}, Name: {Name}, Description {Description}, CreatedAt {CreatedAt}, Status {Status}";
    }
}