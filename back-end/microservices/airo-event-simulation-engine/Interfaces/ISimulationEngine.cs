using airo_event_simulation_domain;

namespace airo_event_simulation_engine.Interfaces;

public interface ISimulationEngine
{
    Task<SimulationResult> RunSimulationAsync(Simulation simulation,
                                              SimulationParameters parameters,
                                              CancellationToken token);
}
