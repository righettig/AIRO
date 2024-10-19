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
    public ISimulationGoal Goal { get; } = goal;
    public ISimulationState State { get; set; } = state;
    public IWinnerTracker WinnerTracker { get; } = winnerTracker;

    public IBotState CreateBotStateFor(Bot bot)
    {
        return new BotState(bot.BotId);
    }

    //private IBotState CreateBotStateFor(Bot bot, Position botPosition)
    //{
    //    // Create a personalized bot state with visible tiles and other relevant information
    //    var visibleTiles = Map.GetVisibleTiles(botPosition, 2); // Assuming bot can see up to 2 tiles
    //    return new BotState(bot.HP, botPosition, visibleTiles);
    //}
}