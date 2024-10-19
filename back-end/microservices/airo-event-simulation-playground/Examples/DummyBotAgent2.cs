using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.Simulation.Actions;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_playground.Examples;

public class DummyBotAgent2 : BaseBotAgent
{
    public override ISimulationAction ComputeNextMove(IBotState botState)
    {
        // Use the helper methods to make decisions
        var nearestFood = botState.GetNearestFoodTile();
        var nearestOpponent = botState.GetNearestOpponentBot();

        if (nearestFood != null)
        {
            // Move towards the nearest food (you would add logic to choose the direction)
            return Move(CalculateDirectionTowards(botState.Position, nearestFood));
        }

        // Otherwise, decide to hold position
        return Hold();
    }

    private static Direction CalculateDirectionTowards(Position myPosition, Position targetPosition)
    {
        // Simplified direction logic; you can expand this for full pathfinding
        if (targetPosition.X > myPosition.X) return Direction.Right;
        if (targetPosition.X < myPosition.X) return Direction.Left;
        if (targetPosition.Y > myPosition.Y) return Direction.Down;
        return Direction.Up;
    }
}
