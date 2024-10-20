using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface ISimulationBot
{
    // this is the internal database botId and it is going to be visible to other players. Should we pass a "name" or a random uuid instead?
    public Guid BotId { get; }
    public Position Position { get; set; }
    public int Health { get; internal set; }
}
