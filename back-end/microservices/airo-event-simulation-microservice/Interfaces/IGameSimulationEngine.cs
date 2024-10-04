using airo_event_simulation_microservice.Models;

namespace airo_event_simulation_microservice.Interfaces;

public interface IGameSimulationEngine
{
    Task<SimulationResult> RunSimulationAsync(GameSimulationParameters parameters, Guid eventId, CancellationToken token);
}
