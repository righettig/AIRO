using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;

namespace airo_event_simulation_engine.Impl;

public class SimulationEngine(IBehaviourExecutor behaviourExecutor) : ISimulationEngine
{
    public event EventHandler<string>? OnLogMessage;

    public async Task<SimulationResult> RunSimulationAsync(ISimulation simulation,
                                                           ISimulationStateUpdater stateUpdater,
                                                           CancellationToken token)
    {
        AddLog("Initializing simulation");

        try
        {
            while (!simulation.Goal.IsSimulationComplete(simulation))
            {
                await ExecuteTurnAsync(simulation, token);

                stateUpdater.UpdateState(simulation);
            }
        }
        catch (Exception ex)
        {
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
            await behaviourExecutor.Execute(p.Bot.BehaviorScript, token);

            AddLog("Executed behaviour for bot: " + p.Bot.BotId);
        }

        AddLog($"Turn finished");
    }

    protected virtual void AddLog(string message)
    {
        OnLogMessage?.Invoke(this, message);
    }
}
