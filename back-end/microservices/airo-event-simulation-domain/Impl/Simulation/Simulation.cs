using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation;

public class Simulation(Guid eventId,
                        Participant[] participants,
                        ISimulationGoal goal, 
                        ISimulationState state, 
                        IWinnerTracker winnerTracker) : ISimulation
{
    public Guid EventId { get; } = eventId;
    public Participant[] Participants { get; } = participants;

    public IBotState CreateBotStateFor(Bot bot)
    {
        // Create a personalized bot state with visible tiles and other relevant information
        var visibleTiles = State.GetVisibleTiles(bot.Position, 2); // Assuming bot can see up to 2 tiles

        return new BotState(bot.BotId, bot.Health, bot.Position, visibleTiles);
    }

    // TODO: think about different simulation type. 
    // Perhaps it's worth grouping together Goal, WinnerTracker and GetActiveParticipants
    // if those can change from one simulation type to another.

    public ISimulationGoal Goal { get; } = goal;
    public ISimulationState State { get; set; } = state;
    public IWinnerTracker WinnerTracker { get; } = winnerTracker;

    // this can be useful if a bot can freeze another one
    public Participant[] GetActiveParticipants()
    {
        return Participants.Where(x => x.Bot.Health > 0).ToArray();
    }
}