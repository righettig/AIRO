using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Impl.WinnerTrackers;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_infrastructure.Interfaces;

namespace airo_event_simulation_infrastructure.Impl;

public class SimulationService(ISimulationConfig config,
                               ISimulationStateFactory simulationStateFactory,
                               IBotBehavioursService botBehavioursRepository,
                               IEventSubscriptionService eventSubscriptionService) : ISimulationService
{
    private string mapString = @"S _ _ _ _ _ _ _ F _ _ _ _ _ _ S
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
_ _ _ _ X X X X X _ _ _ _ _ _ _
_ _ _ _ X I F _ W X _ _ _ I _ _
_ W _ _ X _ W _ _ I X _ _ _ _ _
_ W _ _ X F _ _ F _ X _ _ _ _ _
_ _ _ _ ~ X _ F _ _ X _ _ _ _ _
_ _ _ ~ ~ ~ X _ _ F _ X _ _ _ _
_ _ _ ~ ~ ~ _ _ _ _ _ X _ F _ _
_ F _ ~ X _ F _ _ X X _ _ _ _ _
_ _ _ ~ X _ _ _ X _ _ _ _ _ _ _
_ _ _ ~ ~ _ _ _ _ _ _ W _ _ _ _
_ W _ _ ~ _ _ _ _ _ ~ ~ ~ _ _ _
_ _ _ _ _ _ F _ _ F ~ ~ ~ _ _ _
_ _ _ _ _ _ _ _ _ _ ~ ~ ~ _ _ _
S I _ _ _ _ _ _ _ _ _ _ _ _ _ S";

    public async Task<ISimulation> LoadSimulation(Guid eventId)
    {
        var participants = await Task.WhenAll(
            (await eventSubscriptionService.GetParticipants(eventId))
                .Select(async (x) => {
                    var behaviorScript = await botBehavioursRepository.GetBotBehaviour(x.UserId, x.BotBehaviourId);

                    var bot = new Bot(x.BotId, config.BotHpInitialAmount, behaviorScript);

                    return new Participant(x.UserId, bot);
                })
            );

        // TODO: Event will have a EventMapId. We will load the map using MapService
        var map = new Map(mapString, 16);

        var simulationState = simulationStateFactory.Create(participants, map);

        var simulation = new Simulation(eventId,
                                        participants,
                                        //new TimeBasedGoal(TimeSpan.FromMinutes(1)),
                                        //new TurnBasedGoal(2),
                                        new TurnBasedGoal(10000),
                                        simulationState,
                                        new HealthiestWinnerTracker());

        return simulation;
    }
}
