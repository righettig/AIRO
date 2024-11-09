using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.Simulation.Actions;

namespace airo_event_simulation_domain.Interfaces;

public interface IBotState
{
    Guid Id { get; }
    int Health { get; }
    int Attack { get; }
    int Defense { get; }
    Position Position { get; }
    Dictionary<Position, ITileInfo> VisibleTiles { get; }

    // Find the nearest opponent Bot
    ISimulationBot? GetNearestOpponentBot();

    // Find the nearest food tile
    Position? GetNearestFoodTile();

    bool CanAttack(ISimulationBot? enemy);
    bool CanMove(Direction direction);
}
