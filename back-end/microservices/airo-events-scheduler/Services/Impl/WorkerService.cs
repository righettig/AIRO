using airo_events_scheduler.Services.Interfaces;
using Microsoft.Extensions.Hosting;

namespace airo_events_scheduler.Services.Impl;

public class WorkerService(IRabbitMQConsumerService rabbitMQConsumer, IJobScheduler jobScheduler) : BackgroundService
{
    public override Task StartAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is starting...");

        rabbitMQConsumer.StartListening();

        rabbitMQConsumer.EventCreatedReceived += async (sender, message) =>
        {
            Console.WriteLine($"Scheduling the event start.");
            
            await jobScheduler.ScheduleEventStart(message.EventId, message.ScheduledAt);

            Console.WriteLine($"Scheduled event start at {message.ScheduledAt}.");
        };

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
}