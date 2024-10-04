namespace airo_event_simulation_microservice.Models;

public class SimulationStatus
{
    public Guid EventId { get; set; }
    public List<string> Logs { get; set; } = [];
}
