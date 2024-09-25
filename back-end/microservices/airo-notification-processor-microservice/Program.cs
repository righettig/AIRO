using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = Host
    .CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        var configuration = context.Configuration;

        var eventStoreDbConnectionString = configuration["EVENT_STORE_DB_URL"];
        var rabbitMqUrl = configuration["RABBITMQ_URL"];

        Console.WriteLine("EVENT_STORE_DB_URL: " + eventStoreDbConnectionString);
        Console.WriteLine("RABBITMQ_URL: " + rabbitMqUrl);

        //string rabbitMqHost = configuration["RABBITMQ_URL"] ?? "localhost";

        //builder.Services.AddSingleton<IRabbitMQPublisherService>(sp => new RabbitMQPublisherService(rabbitMqUrl));

        //var settings = EventStoreClientSettings.Create(eventStoreDbConnectionString);
        //var eventStoreClient = new EventStoreClient(settings);
        //var eventStore = new EventStoreDb(eventStoreClient);

        //builder.Services.RegisterHandlers(typeof(BotAggregate).Assembly);

        //services.AddSingleton<IEventStore>(eventStore);

        services.AddHostedService<WorkerService>();

        // TODO
        // register all EventStoreDb stuff
        // register all RabbitMQ stuff
        // subscribe to "BotCreatedEvent, EventCreatedEvent, NewsCreatedEvent"
        // for each event push a message into a queue for the notification service (already implemented)
        // need a processor for each event type
        // need to handle messages on the queue in notification service
        // unit tests
    })
    .Build();

await host.RunAsync();
