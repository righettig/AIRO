﻿using airo_bots_microservice.Domain.Write.Events;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_events_microservice.Domain.Write.Events;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using System.Text;

namespace airo_notification_processor_microservice;

public class WorkerService : BackgroundService
{
    private readonly IEventStore _eventStore;
    private readonly ITimestampService _timestampService;
    private readonly string _rabbitMqUrl;

    private IConnection _rabbitMqConnection;
    private IModel _rabbitMqChannel;

    private DateTime _lastProcessedEventTimestamp;

    public WorkerService(IEventStore eventStore, ITimestampService timestampService, string rabbitMqUrl)
    {
        _eventStore = eventStore;
        _timestampService = timestampService;
        _rabbitMqUrl = rabbitMqUrl;
    }

    public override Task StartAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is starting...");

        _lastProcessedEventTimestamp = _timestampService.LoadTimestamp();
        Console.WriteLine("Reading last processed timestamp: " + _lastProcessedEventTimestamp);

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
                // TODO: it would be better to be able to skip events natively but this would require more work at framework level
                if (@event.CreatedAt <= _lastProcessedEventTimestamp)
                {
                    Console.WriteLine($"Skipping event from streamId {streamId}, Event: {@event.GetType()}, CreatedAt: {@event.CreatedAt}");
                    continue;
                }

                Console.WriteLine($"Event Stream Id: {streamId}, Event: {@event.GetType()}");

                switch (@event)
                {
                    case BotCreatedEvent botCreatedEvent:
                        string message = $"BotCreatedEvent,{botCreatedEvent.Name}";
                        PublishToRabbitMQ("BotCreatedEvent", message);
                        break;

                    case EventCreatedEvent eventCreatedEvent:
                        message = $"EventCreatedEvent,{eventCreatedEvent.Name}";
                        PublishToRabbitMQ("EventCreatedEvent", message);
                        break;

                    // Uncomment if needed in the future
                    // case NewsCreatedEvent newsCreatedEvent:
                    //    break;

                    default:
                        Console.WriteLine("Unknown event type.");
                        break;
                }

                _lastProcessedEventTimestamp = @event.CreatedAt;

                _timestampService.SaveTimestamp(_lastProcessedEventTimestamp);
            }
        }, regex: @"BotCreated|EventCreated|NewsCreated");
    }

    private void PublishToRabbitMQ(string eventType, string message)
    {
        var messageJson = System.Text.Json.JsonSerializer.Serialize(message);
        var messageBody = Encoding.UTF8.GetBytes(messageJson);

        _rabbitMqChannel.BasicPublish(
            exchange: "notifications-exchange",
            routingKey: "notification.created",
            body: messageBody);

        Console.WriteLine($"Published message to RabbitMQ: {eventType}");
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is stopping.");

        _rabbitMqChannel.Close();
        _rabbitMqConnection.Close();
        Console.WriteLine("Closed connection with RabbitMQ");

        return base.StopAsync(cancellationToken);
    }
}