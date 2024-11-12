using airo_event_simulation_microservice.Services.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace airo_event_simulation_microservice.Services.Impl;

public class RabbitMqListener : BackgroundService
{
    private readonly IModel _channel;
    private readonly IBotBehaviourCacheUpdater _redisCacheUpdater;

    private const string ExchangeName = "bot-behaviours-exchange";
    private const string RoutingKey = "bot-behaviour.updated";
    private const string QueueName = "bot-behaviour.updated-queue";

    public RabbitMqListener(string rabbitMqConnectionString, IBotBehaviourCacheUpdater redisCacheUpdater)
    {
        var factory = new ConnectionFactory() { Uri = new Uri(rabbitMqConnectionString) };
        var connection = factory.CreateConnection();
        _channel = connection.CreateModel();

        _channel.ExchangeDeclare(exchange: ExchangeName,
                                 type: "direct",
                                 durable: true);

        _channel.QueueDeclare(queue: QueueName,
                              durable: true,
                              exclusive: false,
                              autoDelete: false);

        _channel.QueueBind(QueueName, ExchangeName, RoutingKey);

        _redisCacheUpdater = redisCacheUpdater;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var consumer = new EventingBasicConsumer(_channel);

        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var botBehaviorMessage = JsonSerializer.Deserialize<BotBehaviorMessage>(message);

            if (botBehaviorMessage != null)
            {
                Console.WriteLine($"Received message: {botBehaviorMessage.BehaviorId}");

                await _redisCacheUpdater.UpdateBotBehaviorAsync(botBehaviorMessage);
            }
        };

        _channel.BasicConsume(queue: QueueName,
                              autoAck: true,
                              consumer: consumer);

        Console.WriteLine("Listening for bot behavior update messages...");

        // wait for messages to arrive
        Console.ReadLine();

        return Task.CompletedTask;
    }
}