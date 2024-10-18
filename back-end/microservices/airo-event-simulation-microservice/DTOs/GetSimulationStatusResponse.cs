namespace airo_event_simulation_microservice.DTOs;

public class GetSimulationStatusResponse
{
    public required Guid EventId { get; set; }
    public required List<string> Logs { get; set; }
}
