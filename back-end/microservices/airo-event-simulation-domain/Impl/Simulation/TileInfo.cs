using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation;

public class TileInfo
{
    public TileType Type { get; set; }
    public ISimulationBot? Bot { get; set; } // Only used if there's a bot on the tile
    // TODO: add "prev" Type without Bot
}
