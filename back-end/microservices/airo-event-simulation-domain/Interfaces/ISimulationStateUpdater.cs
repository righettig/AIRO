namespace airo_event_simulation_domain.Interfaces;

public interface ISimulationStateUpdater
{
    /// <summary>
    /// Updates the simulation state at the end of each turn independently from specific bot actions.
    /// </summary>
    /// <param name="simulation"></param>
    void UpdateState(ISimulation simulation);

    /// <summary>
    /// Update the simulation state after each bot's turn.
    /// </summary>
    /// <param name="simulation"></param>
    /// <param name="bot"></param>
    /// <param name="action"></param>
    void UpdateStateForAction(ISimulation simulation, ISimulationBot bot, ISimulationAction action);
}