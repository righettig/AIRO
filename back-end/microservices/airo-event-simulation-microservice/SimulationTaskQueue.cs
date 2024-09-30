using System.Collections.Concurrent;

namespace airo_event_simulation_microservice;

public class SimulationTaskQueue : IBackgroundTaskQueue
{
    private readonly ConcurrentQueue<(string id, Func<CancellationToken, Task> workItem)> _workItems = new();
    private readonly ConcurrentDictionary<string, CancellationTokenSource> _cancellationTokens = new();
    private readonly SemaphoreSlim _signal = new(0);

    public void QueueBackgroundWorkItem(string id, Func<CancellationToken, Task> workItem)
    {
        var cts = new CancellationTokenSource();
        _cancellationTokens.TryAdd(id, cts);
        _workItems.Enqueue((id, workItem));
        _signal.Release();
    }

    public async Task<Func<CancellationToken, Task>> DequeueAsync(CancellationToken cancellationToken)
    {
        await _signal.WaitAsync(cancellationToken);
        _workItems.TryDequeue(out var workItem);
        return async token =>
        {
            await workItem.workItem(_cancellationTokens[workItem.id].Token);
            _cancellationTokens.TryRemove(workItem.id, out _);
        };
    }

    public bool TryCancelSimulation(string id)
    {
        if (_cancellationTokens.TryRemove(id, out var cts))
        {
            cts.Cancel();
            return true;
        }
        return false;
    }
}
