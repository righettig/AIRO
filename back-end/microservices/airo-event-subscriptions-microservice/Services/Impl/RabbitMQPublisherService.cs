using airo_event_subscriptions_microservice.Services.Interfaces;
using RabbitMQ.Client;
using System.Text;

namespace airo_event_subscriptions_microservice.Services.Impl;

public class RabbitMQPublisherService : IRabbitMQPublisherService
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public RabbitMQPublisherService(string rabbitMqUrl)
    {
        var factory = new ConnectionFactory() { Uri = new Uri(rabbitMqUrl) };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
        _channel.ExchangeDeclare(exchange: "event-subscriptions-exchange",
                                 type: "fanout",
                                 durable: true);
    }

    public void OnEventSubscribed(Guid userId, Guid eventId)
    {
        var messageJson = System.Text.Json.JsonSerializer.Serialize(new { userId, eventId });
        var body = Encoding.UTF8.GetBytes(messageJson);
        _channel.BasicPublish(exchange: "event-subscriptions-exchange",
                              routingKey: "event.subscribed",
                              body: body);
    }

    public void OnEventUnsubscribed(Guid userId, Guid eventId)
    {
        var messageJson = System.Text.Json.JsonSerializer.Serialize(new { userId, eventId });
        var body = Encoding.UTF8.GetBytes(messageJson);
        _channel.BasicPublish(exchange: "event-subscriptions-exchange",
                              routingKey: "event.unsubscribed",
                              body: body);
    }
}
