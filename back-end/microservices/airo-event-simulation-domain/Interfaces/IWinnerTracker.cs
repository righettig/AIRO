using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface IWinnerTracker
{
    Participant? GetWinner(ISimulation simulation);
}