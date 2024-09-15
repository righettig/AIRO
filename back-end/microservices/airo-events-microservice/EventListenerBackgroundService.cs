using airo_cqrs_eventsourcing_lib.Core;

namespace airo_events_microservice;

public class EventListenerBackgroundService(IEventListener eventListener) : IHostedService
{
    private readonly IEventListener _eventListener = eventListener;

    public Task StartAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}