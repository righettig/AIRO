using airo_event_simulation_domain;

namespace airo_event_simulation_infrastructure.Interfaces;

public interface ISimulationService
{
    Task<Simulation> LoadSimulation(Guid eventId);
}
