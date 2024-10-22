using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface ISimulationStateFactory
{
    public ISimulationState Create(Participant[] participants, Map map);
}
