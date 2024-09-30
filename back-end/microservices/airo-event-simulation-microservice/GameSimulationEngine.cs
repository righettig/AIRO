namespace airo_event_simulation_microservice;

public class GameSimulationEngine
{
    public async Task<SimulationResult> RunSimulationAsync(GameSimulationParameters parameters,
                                                           CancellationToken cancellationToken)
    {
        Console.WriteLine("Started simulation");

        await Task.Delay(10 * 1000, cancellationToken);

        Console.WriteLine("Finished simulation");

        return new SimulationResult();
    }
}