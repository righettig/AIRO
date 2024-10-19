﻿using airo_event_simulation_domain.Impl;
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
            while (!simulation.Goal.IsSimulationComplete(simulation))
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
                var botState = simulation.CreateBotStateFor(p.Bot);

                // Ask the bot to compute its next move based on the personalized state
                var action = await behaviourExecutor.Execute(p.Bot.BehaviorScript, botState, token);

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
}
