using airo_events_scheduler.Messages;
using airo_events_scheduler.Services.Interfaces;
using Microsoft.Extensions.Hosting;

namespace airo_events_scheduler.Services.Impl;

public class WorkerService(IRabbitMQConsumerService rabbitMQConsumer, IJobScheduler jobScheduler) : BackgroundService
{
    public override Task StartAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is starting...");

        rabbitMQConsumer.EventCreatedReceived += OnEventCreatedReceived;
        rabbitMQConsumer.EventDeletedReceived += OnEventDeletedReceived;

        rabbitMQConsumer.StartListening();

        return base.StartAsync(cancellationToken);
    }

    protected override Task ExecuteAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Waiting for messages...");

        // Prevent the application from exiting
        Console.ReadLine();

        return Task.CompletedTask;
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is stopping.");

        rabbitMQConsumer.StopListening();

        return base.StopAsync(cancellationToken);
    }

    private async void OnEventCreatedReceived(object sender, EventCreatedMessage message)
    {
        Console.WriteLine($"Scheduling the event start.");

        try
        {
            await jobScheduler.ScheduleEventStart(message.EventId, message.ScheduledAt);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failure scheduling event start at {message.ScheduledAt}: " + ex);
        }
    }

    private async void OnEventDeletedReceived(object sender, EventDeletedMessage message)
    {
        Console.WriteLine($"Deleting scheduled event start.");

        try
        {
            await jobScheduler.DeleteScheduleEventStart(message.EventId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failure deleting scheduled event start {message.EventId}: " + ex);
        }
    }
}