namespace airo_events_microservice.Domain.Read;

public class EventReadModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public override string? ToString()
    {
        return $"Id: {Id}, Name: {Name}, Price {Description}";
    }
}