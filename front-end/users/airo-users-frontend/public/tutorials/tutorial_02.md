# Tutorial 2: Moving in Different Directions

To make your bot mobile, you can use the `BaseBotAgent` class, which provides methods for moving in various directions.

### Steps

1. Extend the `BaseBotAgent` class.
2. Use the `Up()`, `Down()`, `Left()`, and `Right()` methods in `ComputeNextMove` to make the bot move.

### Example

```csharp
using airo_event_simulation_domain.Impl.Simulation;

public class MovingBotAgent : BaseBotAgent
{
    public override ISimulationAction ComputeNextMove(IBotState botState)
    {
        // Move Up as a simple strategy
        return Up();
    }
}
