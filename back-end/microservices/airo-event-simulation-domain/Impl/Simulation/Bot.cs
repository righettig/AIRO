using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation;

public class Bot : ISimulationBot
{
    public Guid BotId { get; }
    public int Health { get; set; }
    public Position Position { get; set; }
    public IBotAgent BotAgent { get; }

    public Bot(Guid botId, int botHpInitialAmount, IBotAgent botAgent)
    {
        ArgumentNullException.ThrowIfNull(botAgent);

        BotId = botId;
        Health = botHpInitialAmount;
        BotAgent = botAgent;
    }
}
