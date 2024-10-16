using airo_events_microservice.Services.Interfaces;
using RabbitMQ.Client;
using System.Text;

namespace airo_events_microservice.Services.Impl;

public class RabbitMQPublisherService : IRabbitMQPublisherService
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public RabbitMQPublisherService(string rabbitMqUrl)
    {
        var factory = new ConnectionFactory() { Uri = new Uri(rabbitMqUrl) };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        _channel.ExchangeDeclare(exchange: "events-exchange",
                                 type: "direct",
                                 durable: true);

        _channel.QueueDeclare(queue: "event.created-queue",
                              durable: true,
                              exclusive: false,
                              autoDelete: false);

        _channel.QueueDeclare(queue: "event.deleted-queue",
                              durable: true,
                              exclusive: false,
                              autoDelete: false);

        _channel.QueueDeclare(queue: "event.completed-queue",
                              durable: true,
                              exclusive: false,
                              autoDelete: false);

        _channel.QueueBind("event.created-queue", "events-exchange", "event.created");
        _channel.QueueBind("event.deleted-queue", "events-exchange", "event.deleted");
        _channel.QueueBind("event.completed-queue", "events-exchange", "event.completed");
    }

    public void OnEventCompleted(Guid eventId, string winnerUserId)
    {
        var messageJson = System.Text.Json.JsonSerializer.Serialize(new { eventId, winnerUserId });
        var body = Encoding.UTF8.GetBytes(messageJson);

        _channel.BasicPublish(exchange: "events-exchange",
                              routingKey: "event.completed",
                              body: body);
    }

    public void OnEventCreated(Guid eventId, DateTime scheduledAt)
    {
        var messageJson = System.Text.Json.JsonSerializer.Serialize(new { eventId, scheduledAt });
        var body = Encoding.UTF8.GetBytes(messageJson);

        _channel.BasicPublish(exchange: "events-exchange",
                              routingKey: "event.created",
                              body: body);
    }

    public void OnEventDeleted(Guid eventId)
    {
        var messageJson = System.Text.Json.JsonSerializer.Serialize(new { eventId });
        var body = Encoding.UTF8.GetBytes(messageJson);

        _channel.BasicPublish(exchange: "events-exchange",
                              routingKey: "event.deleted",
                              body: body);
    }
}
