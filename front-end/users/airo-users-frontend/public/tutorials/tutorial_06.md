# Tutorial: Using `IBotState` to Control Bot Behavior

The `IBotState` interface represents the state of a bot in the simulation. It provides useful information about the bot's health, position, visible tiles, and more, which can be used to make decisions and drive bot behavior.

In this tutorial, you'll learn how to use `IBotState` to control a bot’s actions, such as moving, attacking, and searching for food.

### Steps

1. **Access Bot's State**: `IBotState` contains all the relevant information about a bot.
2. **Check Bot's Status**: Use the properties of `IBotState` to determine things like health, attack power, defense, and position.
3. **Make Decisions**: Use the methods in `IBotState` to make decisions like moving toward food or attacking an opponent.

### Key Properties of `IBotState`

- **Id**: Unique identifier for the bot.
- **Health**: The bot's current health.
- **Attack**: The bot's attack power.
- **Defense**: The bot's defense power.
- **Position**: The current position of the bot on the map.
- **VisibleTiles**: A dictionary of tiles the bot can see, with the position as the key.

### Key Methods of `IBotState`

- **GetNearestOpponentBot()**: Finds the nearest opponent bot.
- **GetNearestFoodTile()**: Finds the nearest food tile.
- **CanAttack()**: Determines whether the bot can attack a given enemy.
- **CanMove()**: Checks if the bot can move in a specified direction.

### Example: Making a Bot Move Toward Food

In this example, we will create a bot agent that moves toward the nearest food tile using `IBotState`.

```csharp
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

public class FoodSeekingBotAgent : BaseBotAgent
{
    public override ISimulationAction ComputeNextMove(IBotState botState)
    {
        // Get the position of the nearest food tile
        var foodPosition = botState.GetNearestFoodTile();

        // If food is found, move towards it
        if (foodPosition != null)
        {
            if (foodPosition.X < botState.Position.X) return Left(); // Move left
            if (foodPosition.X > botState.Position.X) return Right(); // Move right
            if (foodPosition.Y < botState.Position.Y) return Up(); // Move up
            if (foodPosition.Y > botState.Position.Y) return Down(); // Move down
        }

        // If no food is found, hold position
        return Hold();
    }
}