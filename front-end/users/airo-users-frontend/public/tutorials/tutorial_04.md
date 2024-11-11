# Tutorial 4: Seeking Food

Your bot can look for food tiles using the `GetNearestFoodTile` method in `IBotState`.

### Steps

1. Check if a food tile is nearby using `botState.GetNearestFoodTile()`.
2. Move toward the food if it is found.

### Example

```csharp
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

public class FoodSeekingBotAgent : BaseBotAgent
{
    public override ISimulationAction ComputeNextMove(IBotState botState)
    {
        var foodPosition = botState.GetNearestFoodTile();
        
        if (foodPosition != null)
        {
            // Simple logic: if food is found, move towards it
            if (foodPosition.X < botState.Position.X) return Left();
            if (foodPosition.X > botState.Position.X) return Right();
            if (foodPosition.Y < botState.Position.Y) return Up();
            if (foodPosition.Y > botState.Position.Y) return Down();
        }

        return Hold();
    }
}