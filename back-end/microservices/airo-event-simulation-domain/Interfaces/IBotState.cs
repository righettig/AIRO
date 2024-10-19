using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface IBotState
{
    int Health { get; }
    Position Position { get; }
    Dictionary<Position, TileInfo> VisibleTiles { get; }

    // Traverse all visible tiles
    IEnumerable<(Position, TileInfo)> TraverseVisibleTiles();

    // Find the nearest opponent Bot
    Bot GetNearestOpponentBot();

    // Find the nearest food tile
    Position GetNearestFoodTile();
}
