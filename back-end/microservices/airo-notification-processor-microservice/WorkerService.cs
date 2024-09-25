using airo_bots_microservice.Domain.Write.Events;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_events_microservice.Domain.Write.Events;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using System.Text;

public class WorkerService : BackgroundService
{
    private readonly IEventStore _eventStore;
    private readonly string _rabbitMqUrl;

    private IConnection _rabbitMqConnection;
    private IModel _rabbitMqChannel;

    public WorkerService(IEventStore eventStore, string rabbitMqUrl)
    {
        _eventStore = eventStore;
        _rabbitMqUrl = rabbitMqUrl;
    }

    public override Task StartAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is starting...");

        var factory = new ConnectionFactory() { Uri = new Uri(_rabbitMqUrl) };
        _rabbitMqConnection = factory.CreateConnection();
        _rabbitMqChannel = _rabbitMqConnection.CreateModel();
        _rabbitMqChannel.ExchangeDeclare(exchange: "notifications-exchange",
                                         type: "direct",
                                         durable: true);

        return base.StartAsync(cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _eventStore.Subscribe(async (streamId, events) =>
        {
            foreach (var @event in events)
            {
                Console.WriteLine($"Event Stream Id: {streamId}, Event: {@event.GetType()}");

                switch (@event)
                {
                    case BotCreatedEvent botCreatedEvent:
                        byte[] messageBody = Encoding.UTF8.GetBytes($"BotCreatedEvent,{botCreatedEvent.Name}");
                        PublishToRabbitMQ("BotCreatedEvent", messageBody);
                        break;

                    case EventCreatedEvent eventCreatedEvent:
                        messageBody = Encoding.UTF8.GetBytes($"EventCreatedEvent,{eventCreatedEvent.Name}");
                        PublishToRabbitMQ("EventCreatedEvent", messageBody);
                        break;

                    // Uncomment if needed in the future
                    // case NewsCreatedEvent newsCreatedEvent:
                    //    break;

                    default:
                        Console.WriteLine("Unknown event type.");
                        break;
                }
            }
        }, regex: @"BotCreated|EventCreated|NewsCreated");
    }

    private void PublishToRabbitMQ(string eventType, byte[] messageBody)
    {
        _rabbitMqChannel.BasicPublish(
            exchange: "notifications-exchange",
            routingKey: "ui-notifications-queue",
            basicProperties: null,
            body: messageBody);

        Console.WriteLine($"Published message to RabbitMQ: {eventType}");
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is stopping.");

        _rabbitMqChannel.Close();
        _rabbitMqConnection.Close();

        return base.StopAsync(cancellationToken);
    }
}
