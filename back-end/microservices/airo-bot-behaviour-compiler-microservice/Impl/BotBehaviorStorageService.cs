using airo_bot_behaviour_compiler_microservice.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace airo_bot_behaviour_compiler_microservice.Impl;

public class BotBehaviorStorageService(BlobServiceClient blobServiceClient) : IBotBehaviorStorageService
{
    public async Task<string> SaveCompiledBehaviorAsync(string behaviorId, byte[] compiledAssembly)
    {
        var blobContainerClient = blobServiceClient.GetBlobContainerClient("bot-behaviors");

        await blobContainerClient.CreateIfNotExistsAsync(PublicAccessType.None);

        var blobClient = blobContainerClient.GetBlobClient($"{behaviorId}.dll");

        await using var stream = new MemoryStream(compiledAssembly);
        await blobClient.UploadAsync(stream, overwrite: true);

        return blobClient.Uri.ToString();
    }
}
