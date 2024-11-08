using System.Text;
using System.Text.Json;
using airo_bot_behaviour_compiler_microservice.Interfaces;
using RabbitMQ.Client;

namespace airo_bot_behaviour_compiler_microservice.Impl;

public class BotBehaviorUpdateMessage
{
    public required string BehaviorId { get; set; }
    public required string BlobUri { get; set; }
    public DateTime Timestamp { get; set; }
}

public class RabbitMQPublisherService : IRabbitMQPublisherService
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    private const string ExchangeName = "bot-behaviours-exchange";
    private const string RoutingKey = "bot-behaviour.updated";

    public RabbitMQPublisherService(string rabbitMqUrl)
    {
        var factory = new ConnectionFactory() { Uri = new Uri(rabbitMqUrl) };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
        _channel.ExchangeDeclare(exchange: ExchangeName,
                                 type: ExchangeType.Direct,
                                 durable: true);
    }

    public void PublishBotBehaviorUpdate(BotBehaviorUpdateMessage message)
    {
        var messageBody = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(messageBody);

        _channel.BasicPublish(
            exchange: ExchangeName,
            routingKey: RoutingKey,
            basicProperties: null,
            body: body
        );

        Console.WriteLine($"Sent '{RoutingKey}':'{messageBody}'");
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}
