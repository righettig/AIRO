using airo_maps_microservice.DTOs;
using airo_maps_microservice.Models;

namespace airo_maps_microservice.Services;

public interface IMapService
{
    Task<Map> GetMapAsync(string id);
    Task<IEnumerable<Map>> GetMapsAsync();
    Task<Map> CreateMapAsync(MapDto mapDto);
    Task<bool> UpdateMapAsync(string id, MapDto mapDto);
    Task<bool> DeleteMapAsync(string id);
}