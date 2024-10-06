using airo_event_simulation_infrastructure.Interfaces;

namespace airo_event_simulation_infrastructure.Impl;

public class BotBehavioursService : IBotBehavioursService
{
    public Task<string> GetBotBehaviour(string userId, Guid botId)
    {
        var message = $"this is the behaviour for userId {userId}, botId {botId}";
        var script = $"Console.WriteLine(\"{message}\");";
        return Task.FromResult(script);
    }
}
