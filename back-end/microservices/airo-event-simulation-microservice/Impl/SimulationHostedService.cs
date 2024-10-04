using airo_event_simulation_microservice.Interfaces;

namespace airo_event_simulation_microservice.Impl;

public class SimulationHostedService : BackgroundService
{
    private readonly IBackgroundTaskQueue _taskQueue;
    private readonly ILogger<SimulationHostedService> _logger;

    public SimulationHostedService(IBackgroundTaskQueue taskQueue, ILogger<SimulationHostedService> logger)
    {
        _taskQueue = taskQueue;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var workItem = await _taskQueue.DequeueAsync(stoppingToken);

            try
            {
                await workItem(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Simulation task was canceled.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred executing simulation task.");
            }
        }
    }
}
