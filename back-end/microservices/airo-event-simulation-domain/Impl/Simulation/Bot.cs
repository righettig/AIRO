namespace airo_event_simulation_domain.Impl.Simulation;

public class Bot
{
    public Guid BotId { get; }
    public int Health { get; }
    public string BehaviorScript { get; }

    public Bot(Guid botId, string behaviorScript)
    {
        ArgumentException.ThrowIfNullOrEmpty(behaviorScript);

        BotId = botId;
        Health = 100;
        BehaviorScript = behaviorScript;
    }
}
