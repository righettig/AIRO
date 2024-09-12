using RabbitMQ.Client;
using System.Text;

namespace airo_auth_microservice.Services;

public class RabbitMQPublisherService : IRabbitMQPublisherService
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public RabbitMQPublisherService(string rabbitMqUrl)
    {
        var factory = new ConnectionFactory() { Uri = new Uri(rabbitMqUrl) };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
        _channel.ExchangeDeclare(exchange: "auth-exchange",
                                 type: "direct", 
                                 durable: true);
    }

    public void PublishUserCreatedEvent(string message)
    {
        var body = Encoding.UTF8.GetBytes(message);
        _channel.BasicPublish(exchange: "auth-exchange",
                              routingKey: "user.created",
                              basicProperties: null,
                              body: body);
    }
}
