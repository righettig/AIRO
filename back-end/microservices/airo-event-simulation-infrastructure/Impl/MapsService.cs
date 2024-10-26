using System.Net.Http.Json;
using airo_event_simulation_infrastructure.Interfaces;

namespace airo_event_simulation_infrastructure.Impl;

record GetMapByIdResponse(string MapData);

public class MapsService(HttpClient httpClient) : IMapsService
{
    public async Task<string> GetMapById(Guid mapId)
    {
        var response = await httpClient.GetFromJsonAsync<GetMapByIdResponse>($"maps/{mapId}");

        if (response is null)
        {
            throw new Exception($"Failed to retrieve map: {mapId}");
        }

        return response.MapData;
    }
}