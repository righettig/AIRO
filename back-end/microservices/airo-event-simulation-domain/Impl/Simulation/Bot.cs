using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation;

public class Bot : ISimulationBot
{
    public Guid BotId { get; }
    public int Health { get; }
    public string BehaviorScript { get; }
    public Position Position { get; set; }

    public Bot(Guid botId, string behaviorScript)
    {
        ArgumentException.ThrowIfNullOrEmpty(behaviorScript);

        BotId = botId;
        Health = 100;
        BehaviorScript = behaviorScript;
    }
}
