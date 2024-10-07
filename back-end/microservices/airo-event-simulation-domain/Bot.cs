namespace airo_event_simulation_domain;

public class Bot
{
    public Guid BotId { get; }
    public int Health { get; }
    public int Attack { get; }
    public int Defense { get; }
    public string BehaviorScript { get; }

    public Bot(Guid botId, string behaviorScript)
    {
        ArgumentException.ThrowIfNullOrEmpty(behaviorScript);

        BotId = botId;
        Health = 0;
        Attack = 0;
        Defense = 0;
        BehaviorScript = behaviorScript;
    }
}
