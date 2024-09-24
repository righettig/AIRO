using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using Microsoft.Extensions.Hosting;

namespace airo_cqrs_eventsourcing_lib.Web;

public class EventListenerBackgroundService(IEventListener eventListener, IEventStore eventStore) : IHostedService
{
    private readonly IEventListener _eventListener = eventListener;
    private readonly IEventStore _eventStore = eventStore;

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _eventListener.SubscribeTo(_eventStore);

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}