using System.Collections.Concurrent;

namespace airo_event_simulation_microservice;

public class SimulationTaskQueue : IBackgroundTaskQueue
{
    private readonly ConcurrentQueue<(Guid eventId, Func<CancellationToken, Task> workItem)> _workItems = new();
    private readonly ConcurrentDictionary<Guid, CancellationTokenSource> _cancellationTokens = new();
    private readonly SemaphoreSlim _signal = new(0);

    public void QueueBackgroundWorkItem(Guid eventId, Func<CancellationToken, Task> workItem)
    {
        var cts = new CancellationTokenSource();
        _cancellationTokens.TryAdd(eventId, cts);
        _workItems.Enqueue((eventId, workItem));
        _signal.Release();
    }

    public async Task<Func<CancellationToken, Task>> DequeueAsync(CancellationToken cancellationToken)
    {
        await _signal.WaitAsync(cancellationToken);
        _workItems.TryDequeue(out var workItem);
        return async token =>
        {
            await workItem.workItem(_cancellationTokens[workItem.eventId].Token);
            _cancellationTokens.TryRemove(workItem.eventId, out _);
        };
    }

    public bool TryCancelSimulation(Guid eventId)
    {
        if (_cancellationTokens.TryRemove(eventId, out var cts))
        {
            cts.Cancel();
            return true;
        }
        return false;
    }
}
