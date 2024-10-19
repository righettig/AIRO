using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation.Actions;

public enum Direction
{
    Up,
    Down,
    Left,
    Right
}

public class MoveAction(Direction direction) : ISimulationAction
{
    public Direction Direction { get; } = direction;

    public override string ToString() => $"Move[{Direction}]";
}
