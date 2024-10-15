using airo_leaderboard_microservice.Common.Models;
using airo_leaderboard_microservice.Common.Services.Interfaces;

namespace airo_leaderboard_microservice.Common.Services.Impl;

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
