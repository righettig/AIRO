namespace airo_event_simulation_microservice;

public interface IBackgroundTaskQueue
{
    void QueueBackgroundWorkItem(Guid eventId, Func<CancellationToken, Task> workItem);
    Task<Func<CancellationToken, Task>> DequeueAsync(CancellationToken cancellationToken);
    bool TryCancelSimulation(Guid eventId);
    void TryCancelSimulations();
}
