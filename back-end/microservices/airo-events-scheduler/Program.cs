using airo_events_scheduler;
using airo_events_scheduler.Services.Impl;
using airo_events_scheduler.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quartz;
using Quartz.Logging;

LogProvider.SetCurrentLogProvider(new ConsoleLogProvider());

// TODO: set Quartz persistent store
// https://www.quartz-scheduler.net/documentation/quartz-3.x/quick-start.html#fluent-scheduler-builder-api

var host = Host
    .CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        var configuration = context.Configuration;

        var rabbitMqUrl = configuration["RABBITMQ_URL"];

        services.AddSingleton<IRabbitMQConsumerService, RabbitMQConsumerService>(provider => {
            return new RabbitMQConsumerService(rabbitMqUrl);
        });

        services.AddSingleton<IJobScheduler, QuartzJobScheduler>();
        services.AddSingleton<IEventSimulationService, EventSimulationService>();

        services.AddHttpClient<IEventSimulationService, EventSimulationService>(client =>
        {
            var baseApiUrl = configuration["EVENT_SIMULATION_API_URL"];
            client.BaseAddress = new Uri(baseApiUrl);
        });

        services.AddQuartz();

        services.AddQuartzHostedService(options =>
        {
            // when shutting down we want jobs to complete gracefully
            options.WaitForJobsToComplete = true;
        });

        services.AddHostedService<WorkerService>();
    })
    .Build();

await host.RunAsync();
