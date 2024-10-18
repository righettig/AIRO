using airo_common_lib.Time;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.SimulationGoals;

public class TimeBasedGoal(TimeSpan duration, ITimeProvider timeProvider) : ISimulationGoal
{
    private readonly DateTime endTime = timeProvider.Now.Add(duration);

    public bool IsSimulationComplete(ISimulation simulation) => timeProvider.Now >= endTime;
}
