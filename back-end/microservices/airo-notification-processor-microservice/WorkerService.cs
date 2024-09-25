using Microsoft.Extensions.Hosting;

public class WorkerService : BackgroundService
{
    //private readonly EventStoreClient _eventStoreClient;
    //private readonly IConnection _rabbitMqConnection;
    //private readonly IModel _rabbitMqChannel;

    public override Task StartAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is starting...");

        //var factory = new ConnectionFactory() { HostName = "localhost" };
        //_rabbitMqConnection = factory.CreateConnection();
        //_rabbitMqChannel = _rabbitMqConnection.CreateModel();
        //_rabbitMqChannel.QueueDeclare(queue: "my_queue",
        //    durable: false,
        //    exclusive: false,
        //    autoDelete: false,
        //    arguments: null);

        return base.StartAsync(cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        //await foreach (var resolvedEvent in _eventStoreClient.SubscribeToAllAsync(
        //    start: StreamPosition.Start,
        //    filterOptions: new SubscriptionFilterOptions(
        //        EventTypeFilter.Prefix("airo_bots"), 
        //        EventTypeFilter.Prefix("airo_events"), 
        //        EventTypeFilter.Prefix("airo_news")
        //    ),
        //    cancellationToken: stoppingToken))
        //{
        //    var eventType = resolvedEvent.Event.EventType;

        //    if (eventType == "BotCreatedEvent" || eventType == "EventCreatedEvent" || eventType == "NewsCreatedEvent")
        //    {
        //        var data = Encoding.UTF8.GetString(resolvedEvent.Event.Data.ToArray());
        //        Console.WriteLine($"Received event {eventType}: {data}");

        //        PublishToRabbitMQ(eventType, data);
        //    }
        //}
    }

    private void PublishToRabbitMQ(string eventType, string data)
    {
        //var messageBody = Encoding.UTF8.GetBytes($"EventType: {eventType}, Data: {data}");

        //_rabbitMqChannel.BasicPublish(
        //    exchange: "",
        //    routingKey: "my_queue",
        //    basicProperties: null,
        //    body: messageBody);

        //Console.WriteLine($"Published message to RabbitMQ: {eventType}");
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("WorkerService is stopping.");
     
        //_rabbitMqChannel.Close();
        //_rabbitMqConnection.Close();

        return base.StopAsync(cancellationToken);
    }
}
