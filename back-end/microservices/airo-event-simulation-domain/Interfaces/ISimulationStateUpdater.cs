namespace airo_event_simulation_domain.Interfaces;

public interface ISimulationStateUpdater
{
    /// <summary>
    /// Invoked at the beginning of the simulation.
    /// This gives an opportunity to initialise instances.
    /// </summary>
    /// <param name="state"></param>
    /// <param name="logMessage"></param>
    void OnSimulationStart(ISimulationState state, Action<string> logMessage);

    /// <summary>
    /// Updates the simulation state at the end of each turn independently from specific bot actions.
    /// </summary>
    /// <param name="simulation"></param>
    /// <param name="timeStep"></param>
    /// <param name="logMessage"></param>
    void UpdateState(ISimulation simulation, TimeSpan timeStep, Action<string> logMessage);

    /// <summary>
    /// Update the simulation state after each bot's turn.
    /// </summary>
    /// <param name="simulation"></param>
    /// <param name="bot"></param>
    /// <param name="action"></param>
    /// <param name="logMessage"></param>
    void UpdateStateForAction(ISimulation simulation, ISimulationBot bot, ISimulationAction action, Action<string> logMessage);
}