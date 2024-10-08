using airo_events_scheduler.Messages;
using airo_events_scheduler.Services.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace airo_events_scheduler.Services.Impl;

public delegate void EventCreatedHandler(object sender, EventCreatedMessage message);

public class RabbitMQConsumerService : IRabbitMQConsumerService
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public event EventCreatedHandler? EventCreatedReceived;

    public RabbitMQConsumerService(string rabbitMqUrl)
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

        _channel.QueueBind("event.created-queue", "events-exchange", "event.created");
    }

    public void StartListening()
    {
        var consumer = new EventingBasicConsumer(_channel);

        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var eventMessage = JsonSerializer.Deserialize<EventCreatedMessage>(message);

            if (eventMessage != null)
            {
                Console.WriteLine($"Received message: {eventMessage.EventId}, {eventMessage.ScheduledAt}");

                EventCreatedReceived?.Invoke(this, eventMessage);
            }
        };

        _channel.BasicConsume(queue: "event.created-queue",
                              autoAck: true,
                              consumer: consumer);

        Console.WriteLine("Listening for messages on event.created-queue");
    }

    public void StopListening()
    {
        _channel.Close();
        _connection.Close();

        Console.WriteLine("Closed connection with RabbitMQ");
    }
}