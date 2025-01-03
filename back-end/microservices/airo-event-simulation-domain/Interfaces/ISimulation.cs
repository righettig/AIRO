﻿using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Interfaces;

public interface ISimulation
{
    Guid EventId { get; }
    Participant[] Participants { get; }
    ISimulationGoal Goal { get; }
    ISimulationState State { get; set; }
    IWinnerTracker WinnerTracker { get; }
    IBotState CreateBotStateFor(Bot bot);
    Participant[] GetActiveParticipants();
}
