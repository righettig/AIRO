using airo_event_simulation_microservice.Models;

namespace airo_event_simulation_microservice.Interfaces;

public interface ISimulationStatusTracker
{
    void AddLog(Guid eventId, string log);
    SimulationStatus GetSimulationStatus(Guid eventId);
}