using airo_cqrs_eventsourcing_lib.Core.Interfaces;
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

                // TODO: need to be able to get a ref to actual class

                //PublishToRabbitMQ(eventType, data);
            }
        }, regex: @"BotCreated|EventCreated|NewsCreated");
    }

    private void PublishToRabbitMQ(string eventType, string data)
    {
        //var messageBody = Encoding.UTF8.GetBytes($"EventType: {eventType}, Data: {data}");
        var messageBody = Encoding.UTF8.GetBytes("TEST");

        //_rabbitMqChannel.BasicPublish(
        //    exchange: "notifications-exchange",
        //    routingKey: "ui-notifications-queue",
        //    basicProperties: null,
        //    body: messageBody);

        //Console.WriteLine($"Published message to RabbitMQ: {eventType}");
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is stopping.");

        _rabbitMqChannel.Close();
        _rabbitMqConnection.Close();

        return base.StopAsync(cancellationToken);
    }
}
