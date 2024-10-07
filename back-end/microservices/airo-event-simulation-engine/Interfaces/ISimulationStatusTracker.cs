using airo_event_simulation_domain;

namespace airo_event_simulation_engine.Interfaces;

public interface ISimulationStatusTracker
{
    void AddLog(Guid eventId, string log);
    SimulationStatus GetSimulationStatus(Guid eventId);
}