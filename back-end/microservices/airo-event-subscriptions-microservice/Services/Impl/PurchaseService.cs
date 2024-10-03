using airo_event_subscriptions_microservice.Services.Interfaces;

namespace airo_event_subscriptions_microservice.Services.Impl;

public class PurchaseService(HttpClient httpClient) : IPurchaseService
{
    public async Task<bool> OwnsBot(string userId, Guid botId)
    {
        try
        {
            var botsOwned = await httpClient.GetFromJsonAsync<Guid[]>($"purchase/{userId}");

            return botsOwned != null && botsOwned.Contains(botId);
        }
        catch (HttpRequestException httpEx)
        {
            // Handle HTTP request exceptions
            Console.WriteLine($"Error fetching owned bots: {httpEx.Message}");
            throw;
        }
    }
}
