using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.WinnerTrackers;

public class RandomWinnerTracker : IWinnerTracker
{
    private readonly Random random;

    public RandomWinnerTracker() => random = new Random(); // Initialize the random number generator

    public Participant? GetWinner(ISimulation simulation)
    {
        var activeParticipants = simulation.Participants.ToArray();

        if (activeParticipants.Length == 0)
        {
            // No active participants; no winner
            return null;
        }

        // Pick a random index from the active participants
        int winnerIndex = random.Next(activeParticipants.Length);
        return activeParticipants[winnerIndex]; // Return the randomly selected winner
    }
}
