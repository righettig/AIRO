using airo_events_scheduler.Services.Interfaces;

namespace airo_events_scheduler.Services.Impl;

public class EventSimulationService(HttpClient httpClient) : IEventSimulationService
{
    private readonly HttpClient _httpClient = httpClient;

    public async Task StartEventAsync(string eventId)
    {
        var response = await _httpClient.PostAsync($"/simulate/{eventId}", null);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Failed to start event {eventId}");
        }
    }
}
