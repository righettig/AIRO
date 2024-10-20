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

        var deadBots = new HashSet<Guid>(); // move in simulation/simulationState/simulationStateUpdater, see comment below

        try
        {
            while (!simulation.Goal.IsSimulationComplete(simulation))
            {
                var elapsedTime = await MeasureExecutionTimeAsync(
                    () => ExecuteTurnAsync(simulation, simulationStateUpdater, token));

                simulationStateUpdater.UpdateState(simulation, elapsedTime);

                // this is simulation specific
                // this should be moved in simulationStateUpdater.UpdateState(simulation, elapsedTime);
                // passing the logger
                simulation.Participants.Where(x => x.Bot.Health <= 0).ToList().ForEach(x =>
                {
                    if (deadBots.Add(x.Bot.BotId))
                    {
                        AddLog($"Bot {x.Bot.BotId} just died!");
                    }
                });
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

        // TODO: log turn index
        AddLog($"Turn started");

        foreach (var p in simulation.GetActiveParticipants())
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

    private static async Task<TimeSpan> MeasureExecutionTimeAsync(Func<Task> operation)
    {
        var startTime = DateTime.Now;

        await operation();

        var endTime = DateTime.Now;
        return endTime - startTime;
    }

    protected virtual void AddLog(string message)
    {
        OnLogMessage?.Invoke(this, message);
    }
}
