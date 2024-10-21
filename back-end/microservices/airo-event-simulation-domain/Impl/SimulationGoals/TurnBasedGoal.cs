using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.SimulationGoals;

public class TurnBasedGoal(int maxTurns) : ISimulationGoal
{
    private readonly int maxTurns = maxTurns;

    private int currentTurn = 0;

    public bool IsSimulationComplete(ISimulation simulation)
    {
        currentTurn++;
        return currentTurn > maxTurns || simulation.GetActiveParticipants().Length == 1;
    }
}
