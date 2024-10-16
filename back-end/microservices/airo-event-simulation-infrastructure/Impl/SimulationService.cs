using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Impl.WinnerTrackers;
using airo_event_simulation_infrastructure.Interfaces;

namespace airo_event_simulation_infrastructure.Impl;

public class SimulationService(IBotBehavioursService botBehavioursRepository,
                               IEventSubscriptionService eventSubscriptionService) : ISimulationService
{
    public async Task<Simulation> LoadSimulation(Guid eventId)
    {
        var participants = await Task.WhenAll(
            (await eventSubscriptionService.GetParticipants(eventId))
                .Select(async (x) => {
                    var behaviorScript = await botBehavioursRepository.GetBotBehaviour(x.UserId, x.BotBehaviourId);

                    var bot = new Bot(x.BotId, behaviorScript);

                    return new Participant(x.UserId, bot);
                })
            );

        var simulation = new Simulation(eventId,
                                        participants,
                                        //new TimeBasedGoal(TimeSpan.FromMinutes(1)),
                                        new TurnBasedGoal(2),
                                        new SimulationState(1),
                                        new RandomWinnerTracker());

        return simulation;
    }
}
