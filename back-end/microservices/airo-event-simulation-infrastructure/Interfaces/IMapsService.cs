namespace airo_event_simulation_infrastructure.Interfaces;

public interface IMapsService
{
    public Task<string> GetMapById(Guid mapId);
}