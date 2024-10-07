using airo_event_simulation_infrastructure.Interfaces;
using System.Net.Http.Json;

namespace airo_event_simulation_infrastructure.Impl;

record GetBehaviourbyIdResponse(Guid Id, string Name, string Code);

public class BotBehavioursService(HttpClient httpClient) : IBotBehavioursService
{
    public async Task<string> GetBotBehaviour(Guid botBehaviourId)
    {
        var response = await httpClient.GetFromJsonAsync<GetBehaviourbyIdResponse>($"bot-behaviours/{botBehaviourId}");

        if (response is null)
        {
            throw new Exception($"Failed to retrieve behaviour: {botBehaviourId}");
        }
        
        return response.Code;
    }
}
