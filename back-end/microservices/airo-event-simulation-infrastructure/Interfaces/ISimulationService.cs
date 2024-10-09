using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_infrastructure.Interfaces;

public interface ISimulationService
{
    Task<Simulation> LoadSimulation(Guid eventId);
}
