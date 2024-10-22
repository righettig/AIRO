using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface IBotState
{
    Guid Id { get; }
    int Health { get; }
    Position Position { get; }
    Dictionary<Position, ITileInfo> VisibleTiles { get; }

    // Find the nearest opponent Bot
    ISimulationBot? GetNearestOpponentBot();

    // Find the nearest food tile
    Position? GetNearestFoodTile();
}
