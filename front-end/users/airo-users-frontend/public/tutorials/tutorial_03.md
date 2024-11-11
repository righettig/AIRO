# Tutorial 3: Adding Random Movement

To add some unpredictability to your bot, you can make it choose a random direction each turn.

### Steps

1. Use `Random` to select a random action.
2. Add a list of possible actions and choose one randomly in `ComputeNextMove`.

### Example

```csharp
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

public class RandomMovingBotAgent : BaseBotAgent
{
    public override ISimulationAction ComputeNextMove(IBotState botState)
    {
        var actions = new List<ISimulationAction> { Hold(), Up(), Down(), Left(), Right() };
        var random = new Random();
        int actionIndex = random.Next(actions.Count);

        return actions[actionIndex];
    }
}