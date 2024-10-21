using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.Simulation.Actions;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.SimulationStateUpdaters;

public class StateUpdater : ISimulationStateUpdater
{
    private TimeSpan elapsedTime;
    private readonly HashSet<Guid> deadBots;
    private readonly List<Position> originalFoodSpawnLocations;
    private readonly SimulationConfig config;

    public StateUpdater(ISimulationState state, SimulationConfig config)
    {
        elapsedTime = TimeSpan.Zero;
        deadBots = [];
        originalFoodSpawnLocations = GetAllFoodSpawnLocations(state);
        this.config = config;
    }

    public void UpdateState(ISimulation simulation, TimeSpan timeStep, Action<string> logMessage)
    {
        simulation.State.CurrentTurn += 1;

        elapsedTime += timeStep;

        // Decrease HP
        if (elapsedTime.TotalSeconds >= config.BotHpDecayInterval)
        {
            DecreaseBotsHP(simulation, config.BotHpDecayAmount);
            elapsedTime = elapsedTime.Subtract(TimeSpan.FromSeconds(config.BotHpDecayInterval));
        }

        // Respawn food
        if (elapsedTime.TotalSeconds >= config.FoodRespawnInterval)
        {
            var position = RespawnFood(simulation.State);
            logMessage($"Spawning Food at {position}");
            elapsedTime = elapsedTime.Subtract(TimeSpan.FromSeconds(config.FoodRespawnInterval));
        }

        simulation.Participants.Where(x => x.Bot.Health <= 0).ToList().ForEach(x =>
        {
            if (deadBots.Add(x.Bot.BotId))
            {
                logMessage($"Bot {x.Bot.BotId} just died!");
            }
        });
    }

    public void UpdateStateForAction(ISimulation simulation, ISimulationBot bot, ISimulationAction action, Action<string> logMessage)
    {
        if (action is MoveAction moveAction)
        {
            var newPosition = GetNewPosition(bot.Position, moveAction.Direction);

            // Check if the new position is valid (not out of bounds or a wall)
            if (IsValidPosition(newPosition, simulation.State))
            {
                // Check if the new position contains food
                var tile = simulation.State.GetTileAt(newPosition);
                if (tile.Type == TileType.Food)
                {
                    // Remove the food from the map
                    tile.Type = TileType.Empty;

                    // Cannot exceed initial health value
                    bot.Health = Math.Min(bot.Health + config.BotHpRestoreAmount, 100);

                    logMessage($"Bot {bot.BotId} collected food at {newPosition}.");
                }

                // Move the bot on the map
                MoveBot(bot, simulation.State, newPosition);
            }
        }

        logMessage($"Bot {bot.BotId}, Health {bot.Health}, Position {bot.Position}");
    }

    private static void DecreaseBotsHP(ISimulation simulation, int botHpDecayAmount)
    {
        foreach (var participant in simulation.Participants)
        {
            participant.Bot.Health -= botHpDecayAmount;

            if (participant.Bot.Health <= 0)
            {
                var position = participant.Bot.Position;

                simulation.State.Tiles[position.X, position.Y].RestorePrevTile();
            }
        }
    }

    private Position? RespawnFood(ISimulationState state)
    {
        // Randomly pick a location from the original food spawn locations
        Random random = new();
        var spawnLocation = originalFoodSpawnLocations[random.Next(originalFoodSpawnLocations.Count)];

        // Spawn food at the selected location
        if (state.GetTileAt(spawnLocation).Type == TileType.Empty) // Only spawn if the tile is empty
        {
            state.GetTileAt(spawnLocation).Type = TileType.Food;
        }

        return spawnLocation;
    }

    private static List<Position> GetAllFoodSpawnLocations(ISimulationState state)
    {
        var foodSpawns = new List<Position>();
        for (int x = 0; x < state.Tiles.GetLength(0); x++)
        {
            for (int y = 0; y < state.Tiles.GetLength(1); y++)
            {
                if (state.Tiles[x, y].Type == TileType.Food)
                {
                    foodSpawns.Add(new Position(x, y));
                }
            }
        }
        return foodSpawns;
    }

    private static Position GetNewPosition(Position oldPosition, Direction direction)
    {
        return direction switch
        {
            Direction.Up    => new Position(oldPosition.X,     oldPosition.Y - 1),
            Direction.Down  => new Position(oldPosition.X,     oldPosition.Y + 1),
            Direction.Left  => new Position(oldPosition.X - 1, oldPosition.Y),
            Direction.Right => new Position(oldPosition.X + 1, oldPosition.Y),
            _ => oldPosition // No movement
        };
    }

    public static bool IsValidPosition(Position position, ISimulationState state)
    {
        // Check if the position is within bounds and not blocked by walls, etc.
        return position.X >= 0 && position.X < state.Tiles.GetLength(0) &&
               position.Y >= 0 && position.Y < state.Tiles.GetLength(1) &&
               state.GetTileAt(position).Type != TileType.Wall;
    }

    public static void MoveBot(ISimulationBot bot, ISimulationState state, Position newPosition)
    {
        // Update the bot's position on the map
        var oldTile = state.GetTileAt(bot.Position);
        oldTile.RestorePrevTile();

        state.GetTileAt(newPosition).SetBot(bot);

        bot.Position = newPosition;
    }
}