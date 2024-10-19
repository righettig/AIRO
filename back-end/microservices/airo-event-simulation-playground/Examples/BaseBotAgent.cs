using airo_event_simulation_domain.Impl.Simulation.Actions;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_playground.Examples;

public abstract class BaseBotAgent : IBotAgent
{
    public abstract ISimulationAction ComputeNextMove(IBotState botState);

    protected static ISimulationAction Hold() => new HoldAction();
    protected static ISimulationAction Move(Direction direction) => new MoveAction(direction);
    protected static ISimulationAction Up() => new MoveAction(Direction.Up);
    protected static ISimulationAction Down() => new MoveAction(Direction.Down);
    protected static ISimulationAction Left() => new MoveAction(Direction.Left);
    protected static ISimulationAction Right() => new MoveAction(Direction.Right);
}
