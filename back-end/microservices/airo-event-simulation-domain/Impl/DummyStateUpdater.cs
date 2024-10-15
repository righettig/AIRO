using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl;

public class DummyStateUpdater : ISimulationStateUpdater
{
    public void UpdateState(ISimulation simulation)
    {
        simulation.State = new SimulationState(simulation.State.CurrentTurn + 1);

        Console.WriteLine("DummyStateUpdater: Updating simulation state");
    }
}
