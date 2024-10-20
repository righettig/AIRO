using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.SimulationGoals;

public class LastBotStandingGoal : ISimulationGoal
{
    public bool IsSimulationComplete(ISimulation simulation) => simulation.Participants.Count(x => x.Bot.Health > 0) == 1;
}
