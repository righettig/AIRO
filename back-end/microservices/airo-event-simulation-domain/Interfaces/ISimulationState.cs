using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface ISimulationState 
{
    public int CurrentTurn { get; }

    public TileInfo[,] Tiles { get; }
}
