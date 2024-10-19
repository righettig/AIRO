using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface ISimulationBot
{
    public Guid BotId { get; }
    public Position Position { get; set; }
    public int Health { get; }
}
