using airo_maps_microservice.DTOs;
using airo_maps_microservice.Models;
using airo_maps_microservice.Services;
using Microsoft.AspNetCore.Mvc;

namespace airo_maps_microservice.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MapsController(IMapService mapService) : ControllerBase
{
    // GET: api/Maps
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Map>>> GetMaps()
    {
        var maps = await mapService.GetMapsAsync();
        return Ok(maps);
    }

    // GET: api/Maps/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Map>> GetMap(string id)
    {
        var map = await mapService.GetMapAsync(id);

        if (map == null)
        {
            return NotFound();
        }

        return Ok(map);
    }

    // POST: api/Maps
    [HttpPost]
    public async Task<ActionResult<Map>> PostMap(MapDto mapDto)
    {
        // Validate the incoming data
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); // Return a 400 BadRequest if validation fails
        }

        var map = await mapService.CreateMapAsync(mapDto);

        return CreatedAtAction(nameof(GetMap), new { id = map.Id }, map);
    }

    // PUT: api/Maps/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMap(string id, MapDto mapDto)
    {
        // Validate the incoming data
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); // Return a 400 BadRequest if validation fails
        }

        var updated = await mapService.UpdateMapAsync(id, mapDto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE: api/Maps/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMap(string id)
    {
        var deleted = await mapService.DeleteMapAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
