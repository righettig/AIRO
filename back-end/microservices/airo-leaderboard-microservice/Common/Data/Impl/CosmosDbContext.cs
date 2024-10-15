using airo_leaderboard_microservice.Common.Data.Interfaces;
using Microsoft.Azure.Cosmos;

namespace airo_leaderboard_microservice.Common.Data.Impl;

public class CosmosDbContext<T> : ICosmosDbContext<T> where T : class, ILeaderboardEntry
{
    private readonly Container _container;

    public CosmosDbContext(CosmosClient cosmosClient, string databaseId, string containerId)
    {
        _container = cosmosClient.GetContainer(databaseId, containerId);
    }

    public async Task CreateOrUpdateEntryAsync(T entry)
    {
        await _container.UpsertItemAsync(entry, new PartitionKey(entry.Id));
    }

    public async Task<T> GetEntryAsync(string id)
    {
        try
        {
            var response = await _container.ReadItemAsync<T>(id, new PartitionKey(id));
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task<List<T>> GetTopNEntriesAsync(int n)
    {
        var query = $"SELECT * FROM c ORDER BY c.Wins DESC OFFSET 0 LIMIT {n}";
        var queryDefinition = new QueryDefinition(query);
        var iterator = _container.GetItemQueryIterator<T>(queryDefinition);

        var results = new List<T>();
        while (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            results.AddRange(response);
        }

        return results;
    }
}
