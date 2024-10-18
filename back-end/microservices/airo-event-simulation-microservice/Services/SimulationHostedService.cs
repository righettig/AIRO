namespace airo_event_simulation_microservice.Services;

public class SimulationHostedService(IBackgroundTaskQueue taskQueue,
                                     ILogger<SimulationHostedService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var workItem = await taskQueue.DequeueAsync(stoppingToken);

            try
            {
                await workItem(stoppingToken); // TODO: stoppingToken is not being used internally
            }
            catch (OperationCanceledException) // this is thrown when TryCancelSimulation is invoked
            {
                logger.LogInformation("Simulation task was canceled.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred executing simulation task.");
            }
        }

        // Cancel all simulations
        taskQueue.TryCancelSimulations();
    }
}
