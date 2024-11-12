namespace airo_event_simulation_microservice.Services.Interfaces;

public interface IRedisCache
{
    Task StoreDllAsync(string key, byte[] dllData);
    Task<byte[]?> GetDllAsync(string key);
}