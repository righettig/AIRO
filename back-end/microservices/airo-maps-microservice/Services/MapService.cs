using airo_maps_microservice.Data;
using airo_maps_microservice.DTOs;
using airo_maps_microservice.Models;
using Microsoft.EntityFrameworkCore;

namespace airo_maps_microservice.Services;

public class MapService(MapContext context) : IMapService
{
    public async Task<Map> GetMapAsync(string id)
    {
        return await context.Maps.FindAsync(id);
    }

    public async Task<IEnumerable<Map>> GetMapsAsync()
    {
        return await context.Maps.ToListAsync();
    }

    public async Task<Map> CreateMapAsync(MapDto mapDto)
    {
        var map = new Map
        {
            Id = Guid.NewGuid().ToString(),
            MapData = mapDto.MapData
        };

        context.Maps.Add(map);
        await context.SaveChangesAsync();

        return map;
    }

    public async Task<bool> UpdateMapAsync(string id, MapDto mapDto)
    {
        var map = await context.Maps.FindAsync(id);
        if (map == null)
        {
            return false;
        }

        map.MapData = mapDto.MapData;
        context.Entry(map).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await MapExistsAsync(id))
            {
                return false;
            }
            else
            {
                throw;
            }
        }
    }

    public async Task<bool> DeleteMapAsync(string id)
    {
        var map = await context.Maps.FindAsync(id);
        if (map == null)
        {
            return false;
        }

        context.Maps.Remove(map);
        await context.SaveChangesAsync();

        return true;
    }

    private async Task<bool> MapExistsAsync(string id)
    {
        return await context.Maps.AnyAsync(e => e.Id == id);
    }
}
