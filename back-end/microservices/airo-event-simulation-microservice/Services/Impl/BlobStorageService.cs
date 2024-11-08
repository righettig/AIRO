using airo_event_simulation_microservice.Services.Interfaces;
using Azure.Storage.Blobs;

namespace airo_event_simulation_microservice.Services.Impl;

public class BlobStorageService(BlobServiceClient blobServiceClient) : IBlobStorageService
{
    public async Task<byte[]> DownloadDllAsync(string behaviorId)
    {
        var blobContainerClient = blobServiceClient.GetBlobContainerClient("bot-behaviors");
        var blobClient = blobContainerClient.GetBlobClient($"{behaviorId}.dll");
        
        using var memoryStream = new MemoryStream();
        await blobClient.DownloadToAsync(memoryStream);
        return memoryStream.ToArray();
    }
}