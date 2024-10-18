using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_infrastructure.Interfaces;

public interface ISimulationService
{
    Task<ISimulation> LoadSimulation(Guid eventId);
}
