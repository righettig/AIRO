using airo_event_simulation_microservice.Interfaces;

namespace airo_event_simulation_microservice.Impl;

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

    public async Task MarkEventAsCompletedAsync(Guid eventId)
    {
        var response = await _httpClient.PostAsync($"events/{eventId}/complete", null);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Failed to mark event {eventId} as completed");
        }
    }
}
