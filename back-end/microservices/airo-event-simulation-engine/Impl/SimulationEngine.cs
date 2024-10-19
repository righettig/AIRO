using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;

namespace airo_event_simulation_engine.Impl;

public class SimulationEngine(IBehaviourExecutor behaviourExecutor) : ISimulationEngine
{
    public event EventHandler<string>? OnLogMessage;

    public async Task<SimulationResult> RunSimulationAsync(ISimulation simulation,
                                                           ISimulationStateUpdater simulationStateUpdater,
                                                           CancellationToken token)
    {
        AddLog("Initializing simulation");

        try
        {
            while (!simulation.Goal.IsSimulationComplete(simulation)) // TODO: implement LastBotSTandingGoal
            {
                await ExecuteTurnAsync(simulation, simulationStateUpdater, token);

                simulationStateUpdater.UpdateState(simulation);
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

    private async Task ExecuteTurnAsync(ISimulation simulation,
                                        ISimulationStateUpdater simulationStateUpdater,
                                        CancellationToken token)
    {
        token.ThrowIfCancellationRequested();

        AddLog($"Turn started");

        foreach (var p in simulation.Participants)
        {
            try
            {
                //var botPosition = GetBotPosition(bot); // You should have logic to track each bot's position
                //var botHP = GetBotHP(bot); // Retrieve bot's HP

                //var bot = p.Bot;
                //var botPosition = Map.GetBotPosition(bot); // Retrieve the current position of the bot

                var boState = simulation.CreateBotStateFor(p.Bot);

                // Ask the bot to compute its next move based on the personalized state
                var action = await behaviourExecutor.Execute(p.Bot.BehaviorScript, boState, token);

                if (action is null)
                {
                    AddLog($"Error: Behavior execution for bot {p.Bot.BotId} did not return a valid action.");
                }
                else 
                {
                    AddLog($"Executed behaviour for bot {p.Bot.BotId}, result -> {action}");

                    // Update the simulation based on the bot's action
                    simulationStateUpdater.UpdateStateForAction(simulation, p.Bot, action);
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
}
