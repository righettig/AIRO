namespace airo_event_simulation_domain.Interfaces;

public interface IBotAgent
{
    ISimulationAction ComputeNextMove(IBotState botState);
}
