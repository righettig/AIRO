using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_engine.Interfaces;

public interface ISimulationRepository
{
    ISimulation GetByEventId(Guid eventId);
    Task Save(ISimulation simulation);
}
