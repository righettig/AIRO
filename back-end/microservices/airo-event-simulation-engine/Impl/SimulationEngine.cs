using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;

namespace airo_event_simulation_engine.Impl;

public class SimulationEngine(IBehaviourExecutor behaviourExecutor) : ISimulationEngine
{
    public event EventHandler<string>? OnLogMessage;

    //private List<Position> OriginalFoodSpawnLocations { get; }
    //private TimeSpan elapsedTime;

    public async Task<SimulationResult> RunSimulationAsync(ISimulation simulation,
                                                           ISimulationStateUpdater stateUpdater,
                                                           CancellationToken token)
    {
        AddLog("Initializing simulation");

        //OriginalFoodSpawnLocations = Map.GetAllFoodSpawnLocations(); // Store the original food spawn points
        //elapsedTime = TimeSpan.Zero;

        try
        {
            while (!simulation.Goal.IsSimulationComplete(simulation)) // TODO: implement LastBotSTandingGoal
            {
                await ExecuteTurnAsync(simulation, token);

                // Move inside stateUpdater.UpdateState
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

                stateUpdater.UpdateState(simulation);
            }
        }
        catch (Exception ex) 
        {
            // Since ExecuteTurnAsync catches all exceptions this can only be caused by either UpdateState or IsSimulationComplete 

            AddLog($"Error during simulation: {ex.Message}");
            return new SimulationResult(Success: false, ErrorMessage: ex.Message);
        }

        var winner = simulation.WinnerTracker.GetWinner(simulation);

        if (winner != null)
        {
            AddLog($"Simulation completed. Winner: {winner.Bot.BotId}");
        }
        else
        {
            AddLog("Simulation completed. No winner.");
        }

        var result = new SimulationResult(Success: true, WinnerUserId: winner?.UserId);
        return result;
    }

    private async Task ExecuteTurnAsync(ISimulation simulation, CancellationToken token)
    {
        token.ThrowIfCancellationRequested();

        AddLog($"Turn started");

        foreach (var p in simulation.Participants)
        {
            try
            {
                //var bot = participant.Bot;
                //var botPosition = GetBotPosition(bot); // You should have logic to track each bot's position
                //var botHP = GetBotHP(bot); // Retrieve bot's HP

                //var bot = p.Bot;
                //var botPosition = Map.GetBotPosition(bot); // Retrieve the current position of the bot

                // Compute the personalized state for the bot
                //IBotState botState = CreateBotStateFor(bot, botPosition);

                // Ask the bot to compute its next move based on the personalized state
                //ISimulationAction action = bot.ComputeNextMove(botState); // <-- done inside behaviourExecutor

                var action = await behaviourExecutor.Execute(p.Bot.BehaviorScript, simulation.State, token);

                if (action is null)
                {
                    AddLog($"Error: Behavior execution for bot {p.Bot.BotId} did not return a valid action.");
                }
                else 
                {
                    AddLog($"Executed behaviour for bot {p.Bot.BotId}, result -> {action}");

                    // Update the simulation based on the bot's action
                    //ProcessBotAction(bot, action, botPosition);
                    // HandleAction(bot, action);
                }
            }
            catch (TimeoutException)
            {
                AddLog($"Error: Behavior execution for bot {p.Bot.BotId} timed out.");
            }
            catch (Exception ex)
            {
                AddLog($"Error executing behavior for bot {p.Bot.BotId}: {ex.Message}");
            }
        }

        AddLog($"Turn finished");
    }

    protected virtual void AddLog(string message)
    {
        OnLogMessage?.Invoke(this, message);
    }

    // ---> this should fo in StateUpdater
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
    //} // <-- this should also go in stateUpdater

    //private void RemoveBotFromMap(Bot bot)
    //{
    //    // Logic to remove the bot from the map (set its position to empty, etc.)
    //    var botPosition = Map.GetBotPosition(bot);
    //    Map.RemoveBot(botPosition); // Assuming there's a method to remove the bot from the map
    //}

    //private IBotState CreateBotStateFor(Bot bot, Position botPosition)
    //{
    //    // Create a personalized bot state with visible tiles and other relevant information
    //    var visibleTiles = Map.GetVisibleTiles(botPosition, 2); // Assuming bot can see up to 2 tiles
    //    return new BotState(bot.HP, botPosition, visibleTiles);
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

    //private void MoveBot(Bot bot, Direction direction)
    //{
    //    // Update the bot's position on the map based on the direction
    //    // This would involve checking map boundaries, obstacles, etc.
    //    // Example logic:
    //    switch (direction)
    //    {
    //        case Direction.Up:
    //            bot.Position.Y = Math.Max(bot.Position.Y - 1, 0);
    //            break;
    //        case Direction.Down:
    //            bot.Position.Y = Math.Min(bot.Position.Y + 1, Map.Height - 1);
    //            break;
    //        case Direction.Left:
    //            bot.Position.X = Math.Max(bot.Position.X - 1, 0);
    //            break;
    //        case Direction.Right:
    //            bot.Position.X = Math.Min(bot.Position.X + 1, Map.Width - 1);
    //            break;
    //    }
    //}
}
