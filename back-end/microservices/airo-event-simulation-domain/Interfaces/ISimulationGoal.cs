namespace airo_event_simulation_domain.Interfaces;

public interface ISimulationGoal
{
    bool IsSimulationComplete(ISimulation simulation);
}