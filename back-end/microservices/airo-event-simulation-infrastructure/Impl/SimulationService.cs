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
    private readonly string mapString = @"
    {
      ""size"": 4,
      ""tiles"": [
        {
          ""x"": 0,
          ""y"": 0,
          ""type"": ""spawn""
        },
        {
          ""x"": 2,
          ""y"": 0,
          ""type"": ""wall""
        },
        {
          ""x"": 1,
          ""y"": 1,
          ""type"": ""food""
        },
        {
          ""x"": 1,
          ""y"": 2,
          ""type"": ""wood""
        },
        {
          ""x"": 3,
          ""y"": 2,
          ""type"": ""water""
        },
        {
          ""x"": 0,
          ""y"": 3,
          ""type"": ""iron""
        },
        {
          ""x"": 3,
          ""y"": 3,
          ""type"": ""spawn""
        }
      ]
    }";

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
        var map = new Map(mapString);

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
