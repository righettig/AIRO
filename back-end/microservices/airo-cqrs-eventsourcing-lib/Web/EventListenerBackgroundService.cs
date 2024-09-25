using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using Microsoft.Extensions.Hosting;

namespace airo_cqrs_eventsourcing_lib.Web;

public class EventListenerBackgroundService(IEventListener eventListener, IEventStore eventStore, string prefix = "") : BackgroundService
{
    private readonly IEventListener _eventListener = eventListener;
    private readonly IEventStore _eventStore = eventStore;

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _eventListener.SubscribeTo(_eventStore, prefix);

        return Task.CompletedTask;
    }
}
