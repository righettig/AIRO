using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.SimulationGoals;

public class TimeBasedGoal(TimeSpan duration) : ISimulationGoal
{
    private readonly DateTime endTime = DateTime.Now.Add(duration);

    public bool IsSimulationComplete(ISimulation simulation) => DateTime.Now >= endTime;
}
