using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.SimulationStateUpdaters;

public class DummyStateUpdater : ISimulationStateUpdater
{
    public void OnSimulationStart(ISimulationState state, Action<string> logMessage)
    {
        logMessage("DummyStateUpdater: OnSimulationStart");
    }

    public void UpdateState(ISimulation simulation, TimeSpan timeStep, Action<string> logMessage)
    {
        simulation.State = new SimulationState(simulation.State.CurrentTurn + 1);

        logMessage("DummyStateUpdater: Updating global simulation state");
    }

    public Task UpdateStateForAction(ISimulation simulation,
                                     ISimulationBot bot,
                                     ISimulationAction action,
                                     Action<string> logMessage)
    {
        logMessage($"DummyStateUpdater: Updating simulation state for bot {bot.BotId} after action {action}");


        return Task.CompletedTask;
    }
}
