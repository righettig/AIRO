using System.Collections.Concurrent;
using airo_event_simulation_microservice.Services.Interfaces;

namespace airo_event_simulation_microservice.Services.Impl;

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
        _workItems.TryDequeue(out var workItemEntry);
        return async token =>
        {
            await workItemEntry.workItem(_cancellationTokens[workItemEntry.eventId].Token);
            _cancellationTokens.TryRemove(workItemEntry.eventId, out _);
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

    public void TryCancelSimulations()
    {
        foreach (var item in _cancellationTokens)
        {
            TryCancelSimulation(item.Key);
        }
    }
}
