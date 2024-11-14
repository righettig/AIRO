using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface ISimulationBot
{
    /// <summary>
    /// Uniquely identify the bot.
    /// </summary>
    public Guid BotId { get; }
    public Position Position { get; set; }
    public int Health { get; set; }
    public int Attack { get; set; }
    public int Defense { get; set; }
}
