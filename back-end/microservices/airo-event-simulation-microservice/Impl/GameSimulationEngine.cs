using airo_event_simulation_microservice.Interfaces;
using airo_event_simulation_microservice.Models;

namespace airo_event_simulation_microservice.Impl;

public class GameSimulationEngine(ISimulationStatusTracker statusTracker) : IGameSimulationEngine
{
    private readonly ISimulationStatusTracker _statusTracker = statusTracker;

    public async Task<SimulationResult> RunSimulationAsync(GameSimulationParameters parameters,
                                                           Guid eventId,
                                                           CancellationToken token)
    {
        // Add logs at different stages of the simulation
        _statusTracker.AddLog(eventId, "Initializing simulation");

        await Task.Delay(10 * 1000, token); // Simulating some process
        _statusTracker.AddLog(eventId, "Running step 1");

        await Task.Delay(10 * 1000, token); // Simulating another process
        _statusTracker.AddLog(eventId, "Running step 2");

        await Task.Delay(10 * 1000, token); // Simulating final process
        _statusTracker.AddLog(eventId, "Finalizing simulation");

        // Simulation completed
        var result = new SimulationResult
        {
            Success = true
            // Other result data
        };

        _statusTracker.AddLog(eventId, "Simulation completed");

        return result;
    }
}
