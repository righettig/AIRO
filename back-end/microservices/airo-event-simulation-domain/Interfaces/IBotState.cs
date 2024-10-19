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

public class BotState : IBotState
{
    public int Health => throw new NotImplementedException();

    public Position Position => throw new NotImplementedException();

    public Dictionary<Position, TileInfo> VisibleTiles => throw new NotImplementedException();

    public Position GetNearestFoodTile()
    {
        throw new NotImplementedException();
    }

    public Bot GetNearestOpponentBot()
    {
        throw new NotImplementedException();
    }

    public IEnumerable<(Position, TileInfo)> TraverseVisibleTiles()
    {
        throw new NotImplementedException();
    }
}