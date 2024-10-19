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
        simulation.State = new SimulationState(simulation.State.CurrentTurn + 1);

        //elapsedTime += timeStep;

        //// Decrease HP every minute
        //if (elapsedTime.TotalMinutes >= 1)
        //{
        //    DecreaseBotsHP();
        //    elapsedTime = elapsedTime.Subtract(TimeSpan.FromMinutes(1)); // Reset the 1-minute counter
        //}

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
            MoveBot(bot, moveAction.Direction);
        }

        Console.WriteLine($"Bot {bot.BotId}, Health {bot.Health}, Position ({bot.Position.X},{bot.Position.Y})");
    }

    private static void MoveBot(ISimulationBot bot, Direction direction)
    {
        const int MAP_HEIGHT = 128;
        const int MAP_WIDTH = 128;

        // Update the bot's position on the map based on the direction
        // This would involve checking map boundaries, obstacles, etc.
        // Example logic:
        switch (direction)
        {
            case Direction.Up:
                bot.Position = new Position(bot.Position.X, Math.Max(bot.Position.Y - 1, 0));
                break;
            case Direction.Down:
                bot.Position = new Position(bot.Position.X, Math.Min(bot.Position.Y + 1, MAP_HEIGHT - 1));
                break;
            case Direction.Left:
                bot.Position = new Position(Math.Max(bot.Position.X - 1, 0), bot.Position.Y);
                break;
            case Direction.Right:
                bot.Position = new Position(Math.Min(bot.Position.X + 1, MAP_WIDTH - 1), bot.Position.Y);
                break;
        }
    }

    //private void DecreaseBotsHP()
    //{
    //    foreach (var participant in Participants.ToList())
    //    {
    //        participant.Bot.HP -= 5; // Decrease bot HP by 5

    //        // Remove bots that have 0 HP or less
    //        if (participant.Bot.HP <= 0)
    //        {
    //            RemoveBotFromMap(participant.Bot);
    //            Participants.Remove(participant);
    //        }
    //    }
    //}

    //private void RemoveBotFromMap(Bot bot)
    //{
    //    // Logic to remove the bot from the map (set its position to empty, etc.)
    //    var botPosition = Map.GetBotPosition(bot);
    //    Map.RemoveBot(botPosition); // Assuming there's a method to remove the bot from the map
    //}

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
}