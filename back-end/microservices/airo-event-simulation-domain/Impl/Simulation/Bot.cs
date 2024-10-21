using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation;

public class Bot : ISimulationBot
{
    public Guid BotId { get; }
    public int Health { get; set; }
    public Position Position { get; set; }
    public string BehaviorScript { get; }

    public Bot(Guid botId, int botHpInitialAmount, string behaviorScript)
    {
        ArgumentException.ThrowIfNullOrEmpty(behaviorScript);

        BotId = botId;
        Health = botHpInitialAmount;
        BehaviorScript = behaviorScript;
    }
}
