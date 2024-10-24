﻿using Microsoft.Azure.Cosmos;

namespace airo_maps_microservice.Services;

public class CosmosDbInitializationService : IHostedService
{
    private readonly CosmosClient _cosmosClient;
    private readonly ILogger<CosmosDbInitializationService> _logger;
    private readonly string _databaseId;

    public CosmosDbInitializationService(CosmosClient cosmosClient, ILogger<CosmosDbInitializationService> logger, string databaseId)
    {
        _cosmosClient = cosmosClient;
        _logger = logger;
        _databaseId = databaseId;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting CosmosDB Initialization...");

        Database database = await _cosmosClient.CreateDatabaseIfNotExistsAsync(
            id: _databaseId,
            throughput: 400,
            cancellationToken: cancellationToken
        );

        _logger.LogInformation($"{_databaseId} database created or already exists.");

        await database.CreateContainerIfNotExistsAsync(
            id: "maps",
            partitionKeyPath: "/id",
            cancellationToken: cancellationToken
        );
        _logger.LogInformation("Maps container created or already exists.");
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        // No action required on stopping
        return Task.CompletedTask;
    }
}