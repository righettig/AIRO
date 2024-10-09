using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_engine.Interfaces;

public interface ISimulationEngine
{
    event EventHandler<string>? OnLogMessage;

    Task<SimulationResult> RunSimulationAsync(ISimulation simulation,
                                              ISimulationStateUpdater stateUpdater,
                                              CancellationToken token);
}
