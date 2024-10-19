using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface ISimulationState 
{
    public int CurrentTurn { get; set; }

    public TileInfo[,] Tiles { get; }

    Dictionary<Position, TileInfo> GetVisibleTiles(Position position, int size);
}
