using airo_event_simulation_microservice.Services.Interfaces;

namespace airo_event_simulation_microservice.Services.Impl;

public class RedisCacheUpdater(IRedisCache redisCache,
                               IBlobStorageService blobStorageService) : IBotBehaviourCacheUpdater
{
    public async Task UpdateBotBehaviorAsync(BotBehaviorMessage message)
    {
        // load the latest DLL from Azure Blob Storage
        var dllData = await blobStorageService.DownloadDllAsync(message.BehaviorId);

        if (dllData != null && dllData.Length > 0)
        {
            // update the Redis cache with the fresh DLL data
            await redisCache.StoreDllAsync(message.BehaviorId, dllData);

            Console.WriteLine($"Redis cache updated for BehaviorId: {message.BehaviorId}.");
        }
        else
        {
            Console.WriteLine($"Failed to retrieve DLL for BehaviorId: {message.BehaviorId} from Blob Storage.");
        }
    }
}