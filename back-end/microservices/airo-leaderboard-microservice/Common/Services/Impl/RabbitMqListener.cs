using airo_leaderboard_microservice.Common.Services.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace airo_leaderboard_microservice.Common.Services.Impl;

public class RabbitMqListener : BackgroundService
{
    private readonly IEventCompletedProcessor _eventProcessor;
    private readonly IConnection _connection;
    private readonly IModel _channel;   

    public RabbitMqListener(IEventCompletedProcessor eventProcessor, string rabbitMqUrl)
    {
        _eventProcessor = eventProcessor;

        var factory = new ConnectionFactory() { Uri = new Uri(rabbitMqUrl) };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
    }

    public override Task StartAsync(CancellationToken cancellationToken)
    {
        _channel.ExchangeDeclare(exchange: "events-exchange",
                                 type: "direct",
                                 durable: true);

        _channel.QueueDeclare(queue: "event.completed-queue",
                              durable: true,
                              exclusive: false,
                              autoDelete: false);

        _channel.QueueBind("event.completed-queue", "events-exchange", "event.completed");

        return base.StartAsync(cancellationToken);
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var consumer = new EventingBasicConsumer(_channel);

        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var eventCompleted = JsonSerializer.Deserialize<EventCompletedMessage>(message);

            if (eventCompleted != null)
            {
                Console.WriteLine($"Received message: {eventCompleted.EventId}, {eventCompleted.WinnerUserId}");
                await _eventProcessor.ProcessEventAsync(eventCompleted);
            }
        };

        _channel.BasicConsume(queue: "event.completed-queue",
                              autoAck: true,
                              consumer: consumer);

        // wait for messages to arrive
        Console.ReadLine();

        return Task.CompletedTask;
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        _channel.Close();
        _connection.Close();

        Console.WriteLine("Closed connection with RabbitMQ");

        return base.StopAsync(cancellationToken);
    }
}
