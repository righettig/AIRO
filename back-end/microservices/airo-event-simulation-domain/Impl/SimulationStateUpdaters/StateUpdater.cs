using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.Simulation.Actions;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.SimulationStateUpdaters;

public class StateUpdater : ISimulationStateUpdater
{
    private TimeSpan elapsedTime;

    //private List<Position> OriginalFoodSpawnLocations { get; }

    public StateUpdater()
    {
        //OriginalFoodSpawnLocations = Map.GetAllFoodSpawnLocations(); // Store the original food spawn points
        elapsedTime = TimeSpan.Zero;
    }

    public void UpdateState(ISimulation simulation)
    {
        simulation.State.CurrentTurn += 1;

        //elapsedTime += timeStep;

        // Decrease HP every minute
        //if (elapsedTime.TotalMinutes >= 1)
        //{
        //    DecreaseBotsHP();
        //    elapsedTime = elapsedTime.Subtract(TimeSpan.FromMinutes(1)); // Reset the 1-minute counter
        //}
        DecreaseBotsHP(simulation);

        //// Respawn food every 10 minutes
        //if (elapsedTime.TotalMinutes >= 10)
        //{
        //    RespawnFood();
        //    elapsedTime = elapsedTime.Subtract(TimeSpan.FromMinutes(10)); // Reset the 10-minute counter
        //}
    }

    public void UpdateStateForAction(ISimulation simulation, ISimulationBot bot, ISimulationAction action)
    {
        if (action is MoveAction moveAction)
        {
            MoveBot(simulation.State, bot, moveAction.Direction);
        }

        Console.WriteLine($"Bot {bot.BotId}, Health {bot.Health}, Position ({bot.Position.X},{bot.Position.Y})");
    }

    private static void MoveBot(ISimulationState state, ISimulationBot bot, Direction direction)
    {
        var size = state.Tiles.GetLength(0); // assuming square map

        var tile = state.Tiles[bot.Position.X, bot.Position.Y];
        
        tile.SetEmpty();

        // Update the bot's position on the map based on the direction
        // This would involve checking map boundaries, obstacles, etc.
        // Example logic:
        switch (direction)
        {
            case Direction.Up:
                bot.Position = new Position(bot.Position.X, Math.Max(bot.Position.Y - 1, 0));
                break;
            case Direction.Down:
                bot.Position = new Position(bot.Position.X, Math.Min(bot.Position.Y + 1, size - 1));
                break;
            case Direction.Left:
                bot.Position = new Position(Math.Max(bot.Position.X - 1, 0), bot.Position.Y);
                break;
            case Direction.Right:
                bot.Position = new Position(Math.Min(bot.Position.X + 1, size - 1), bot.Position.Y);
                break;
        }

        tile = state.Tiles[bot.Position.X, bot.Position.Y];

        tile.SetBot(bot);
    }

    private static void DecreaseBotsHP(ISimulation simulation)
    {
        foreach (var participant in simulation.Participants)
        {
            participant.Bot.Health -= 5;

            if (participant.Bot.Health <= 0)
            {
                var position = participant.Bot.Position;

                simulation.State.Tiles[position.X, position.Y].SetEmpty();
            }
        }
    }

    //private void RespawnFood()
    //{
    //    // Randomly pick a location from the original food spawn locations
    //    Random random = new Random();
    //    var spawnLocation = OriginalFoodSpawnLocations[random.Next(OriginalFoodSpawnLocations.Count)];

    //    // Spawn food at the selected location
    //    if (Map.GetTile(spawnLocation).Type == TileType.Empty) // Only spawn if the tile is empty
    //    {
    //        Map.SpawnFood(spawnLocation);
    //    }
    //}

    //private void ProcessBotAction(Bot bot, ISimulationAction action, Position oldPosition)
    //{
    //    if (action is MoveAction moveAction)
    //    {
    //        var newPosition = GetNewPosition(oldPosition, moveAction.Direction);

    //        // Check if the new position is valid (not out of bounds or a wall)
    //        if (Map.IsValidPosition(newPosition))
    //        {
    //            // Move the bot on the map
    //            Map.MoveBot(bot, oldPosition, newPosition);

    //            // Check if the new position contains food
    //            var tile = Map.GetTile(newPosition);
    //            if (tile.Type == TileType.Food)
    //            {
    //                // Remove the food from the map
    //                Map.RemoveFood(newPosition);
    //            }
    //        }
    //    }
    //}

    //private Position GetNewPosition(Position oldPosition, Direction direction)
    //{
    //    // Calculate new position based on the direction of movement
    //    return direction switch
    //    {
    //        Direction.Up => new Position(oldPosition.X, oldPosition.Y - 1),
    //        Direction.Down => new Position(oldPosition.X, oldPosition.Y + 1),
    //        Direction.Left => new Position(oldPosition.X - 1, oldPosition.Y),
    //        Direction.Right => new Position(oldPosition.X + 1, oldPosition.Y),
    //        _ => oldPosition // No movement
    //    };
    //}
}