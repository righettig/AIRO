using airo_event_simulation_infrastructure.Interfaces;
using System.Net.Http.Json;

namespace airo_event_simulation_infrastructure.Impl;

public class EventSubscriptionService(HttpClient httpClient) : IEventSubscriptionService
{
    public async Task<EventSubscriptionDto[]> GetParticipants(Guid eventId)
    {
        var response = await httpClient.GetFromJsonAsync<EventSubscriptionDto[]>($"eventsubscriptions/{eventId}/full");
        
        if (response is null)
        {
            throw new Exception($"Failed to retrieve subscription data for event: {eventId}");
        }

        return response;
    }
}
