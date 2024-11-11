using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation;

public class Bot : ISimulationBot
{
    public Guid BotId { get; }
    public int Health { get; set; }
    public int Attack { get; set; }
    public int Defense { get; set; }
    public Position Position { get; set; }
    public IBotAgent BotAgent { get; }

    public Bot(Guid botId, int health, int attack, int defense, IBotAgent botAgent)
    {
        ArgumentNullException.ThrowIfNull(botAgent);

        BotId = botId;
        Health = health;
        Attack = attack;
        Defense = defense;
        BotAgent = botAgent;
    }
}
