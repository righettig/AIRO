namespace airo_event_simulation_microservice.Services.Interfaces;

public interface IBlobStorageService
{
    Task<byte[]> DownloadDllAsync(string behaviorId);
}
