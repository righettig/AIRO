using airo_event_simulation_domain;
using airo_event_simulation_engine.Interfaces;

namespace airo_event_simulation_engine.Impl;

public class SimulationEngine(
    ISimulationStatusTracker statusTracker,
    IBehaviourExecutor behaviourExecutor) : ISimulationEngine
{
    private Guid eventId;

    // TODO: add event so that I can get rid of the ISimulationStatusTracker dependency
    // from playground I can log to console and I do not even need to instantiate ISimulationStatusTracker
    public async Task<SimulationResult> RunSimulationAsync(Simulation simulation,
                                                           SimulationParameters parameters,
                                                           CancellationToken token)
    {
        eventId = simulation.EventId;

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

    private void AddLog(string message) 
    {
        statusTracker.AddLog(eventId, message);
    }
}
