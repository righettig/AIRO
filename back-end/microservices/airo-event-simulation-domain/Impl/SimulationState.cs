using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl;

public class SimulationState : ISimulationState
{
    public SimulationState(int currentTurn)
    {
        CurrentTurn = currentTurn;
    }

    public int CurrentTurn { get; }
}
