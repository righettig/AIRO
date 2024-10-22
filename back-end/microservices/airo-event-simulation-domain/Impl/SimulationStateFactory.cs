using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl;

public class SimulationStateFactory : ISimulationStateFactory
{
    public ISimulationState Create(Participant[] participants, Map map) 
    {
        var result = new SimulationState(1);
        result.InitializeSimulation(participants, map);
        return result;
    }
}
