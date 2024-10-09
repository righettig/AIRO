using airo_event_simulation_domain;
using airo_event_simulation_engine.Interfaces;

namespace airo_event_simulation_engine.Impl;

public class SimulationEngine(IBehaviourExecutor behaviourExecutor) : ISimulationEngine
{
    public event EventHandler<string>? OnLogMessage;

    public async Task<SimulationResult> RunSimulationAsync(Simulation simulation, CancellationToken token)
    {
        AddLog("Initializing simulation");

        for (int i = 0; i < 5; i++) // 5 turns
        {
            AddLog($"Turn {i} started");

            foreach (var p in simulation.Participants)
            {
                await behaviourExecutor.Execute(p.Bot.BehaviorScript, token);
                
                AddLog("Executed behaviour for bot: " + p.Bot.BotId);
                AddLog("Updated simulation state");
            }

            AddLog($"Turn {i} finished");
        }

        AddLog("Simulation completed");

        var result = new SimulationResult(Success: true);
        return result;
    }

    protected virtual void AddLog(string message)
    {
        OnLogMessage?.Invoke(this, message);
    }
}
