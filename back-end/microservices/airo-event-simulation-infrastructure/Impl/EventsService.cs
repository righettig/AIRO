using airo_event_simulation_infrastructure.Interfaces;
using System.Net.Http.Json;

namespace airo_event_simulation_infrastructure.Impl;

record GetMapIdForEvent(Guid MapId);

public class EventsService(HttpClient httpClient) : IEventsService
{
    private readonly HttpClient _httpClient = httpClient;

    public async Task MarkEventAsStartedAsync(Guid eventId)
    {
        var response = await _httpClient.PostAsync($"events/{eventId}/start", null);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Failed to mark event {eventId} as started");
        }
    }

    public async Task MarkEventAsCompletedAsync(Guid eventId, string winnerUserId)
    {
        var response = await _httpClient.PostAsJsonAsync($"events/{eventId}/complete", new { winnerUserId });

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Failed to mark event {eventId} as completed");
        }
    }

    public async Task<Guid> GetMapId(Guid eventId)
    {
        var response = await _httpClient.GetFromJsonAsync<GetMapIdForEvent>($"events/{eventId}");

        if (response is null)
        {
            throw new Exception($"Failed to retrieve MapId for event {eventId}");
        }

        return response.MapId;
    }
}
