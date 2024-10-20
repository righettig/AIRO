using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.WinnerTrackers;

public class HealthiestWinnerTracker : IWinnerTracker
{
    public Participant? GetWinner(ISimulation simulation)
    {
        var activeParticipants = simulation.GetActiveParticipants();

        if (activeParticipants.Length == 0)
        {
            // No active participants; no winner
            return null;
        }

        return activeParticipants.OrderBy(x => x.Bot.Health).First();
    }
}
