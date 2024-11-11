# Tutorial 1: Setting Up Your First Bot Agent

To create a bot in our simulation, you’ll start by implementing the `IBotAgent` interface. This interface has one key method: `ComputeNextMove`, which returns the next action your bot will take.

### Steps

1. **Create a new bot agent class** that implements the `IBotAgent` interface.
2. **Implement the `ComputeNextMove` method** to define how the bot will decide its next move.

### Example

```csharp
using airo_event_simulation_domain.Interfaces;

public class SimpleBotAgent : IBotAgent
{
    public ISimulationAction ComputeNextMove(IBotState botState)
    {
        // Basic action: Hold position
        return new HoldAction();
    }
}
