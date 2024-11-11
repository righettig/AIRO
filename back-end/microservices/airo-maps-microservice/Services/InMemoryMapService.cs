using airo_maps_microservice.DTOs;
using airo_maps_microservice.Models;
using System.Collections.Concurrent;

namespace airo_maps_microservice.Services;

public class InMemoryMapService : IMapService
{
    private readonly ConcurrentDictionary<string, Map> _maps = new();

    public Task<Map> GetMapAsync(string id)
    {
        _maps.TryGetValue(id, out var map);
        return Task.FromResult(map);
    }

    public Task<IEnumerable<Map>> GetMapsAsync()
    {
        return Task.FromResult(_maps.Values.AsEnumerable());
    }

    public Task<Map> CreateMapAsync(MapDto mapDto)
    {
        var newMap = new Map
        {
            Id = Guid.NewGuid().ToString(),
            MapData = mapDto.MapData,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _maps[newMap.Id] = newMap;
        return Task.FromResult(newMap);
    }

    public Task<bool> UpdateMapAsync(string id, MapDto mapDto)
    {
        if (_maps.TryGetValue(id, out var existingMap))
        {
            existingMap.MapData = mapDto.MapData;
            existingMap.UpdatedAt = DateTime.UtcNow;
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<bool> DeleteMapAsync(string id)
    {
        return Task.FromResult(_maps.TryRemove(id, out _));
    }
}
