using airo_event_simulation_domain;

namespace airo_event_simulation_engine.Interfaces;

public interface ISimulationEngine
{
    event EventHandler<string>? OnLogMessage;

    Task<SimulationResult> RunSimulationAsync(Simulation simulation, CancellationToken token);
}
