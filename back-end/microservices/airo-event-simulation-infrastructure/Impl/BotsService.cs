using System.Net.Http.Json;
using airo_event_simulation_infrastructure.Interfaces;

namespace airo_event_simulation_infrastructure.Impl;

public class BotsService(HttpClient httpClient) : IBotsService
{
    public async Task<BotDto> GetBotById(Guid botId)
    {
        var response = await httpClient.GetFromJsonAsync<BotDto>($"bot?ids={botId}");

        if (response is null)
        {
            throw new Exception($"Failed to retrieve bot: {botId}");
        }

        return response;
    }
}