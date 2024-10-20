using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface ITileInfo
{
    public TileType Type { get; }
    public ISimulationBot? Bot { get; }
}
