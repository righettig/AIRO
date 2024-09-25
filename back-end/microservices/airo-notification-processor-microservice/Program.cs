﻿using airo_cqrs_eventsourcing_lib.EventStore;
using EventStore.Client;
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

        var settings = EventStoreClientSettings.Create(eventStoreDbConnectionString);
        var eventStoreClient = new EventStoreClient(settings);
        var eventStore = new EventStoreDb(eventStoreClient);

        services.AddHostedService(_ => new WorkerService(eventStore, rabbitMqUrl));
    })
    .Build();

await host.RunAsync();
