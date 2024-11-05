using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Impl.WinnerTrackers;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_infrastructure.Interfaces;
using airo_event_simulation_microservice.Services.Interfaces;
using System.Reflection;

namespace airo_event_simulation_infrastructure.Impl;

public class SimulationService(ISimulationConfig config,
                               ISimulationStateFactory simulationStateFactory,
                               IRedisCache redisCacheService,
                               IBotAgentFactory botAgentFactory,
                               IEventSubscriptionService eventSubscriptionService,
                               IEventsService eventsService,
                               IMapsService mapsService) : ISimulationService
{
    public async Task<ISimulation> LoadSimulation(Guid eventId)
    {
        var mapId = await eventsService.GetMapId(eventId);
        var mapString = await mapsService.GetMapById(mapId);

        var participants = await Task.WhenAll(
            (await eventSubscriptionService.GetParticipants(eventId))
                .Select(async (x) => {
                    var assembly = await GetBotBehaviourAssembly(x.BotBehaviourId);

                    var botAgent = botAgentFactory.Create(assembly);

                    var bot = new Bot(x.BotId, config.BotHpInitialAmount, botAgent);

                    return new Participant(x.UserId, bot);
                })
            );

        // TODO: use factory to avoid passing real map in unit tests
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

    public async Task<Assembly> GetBotBehaviourAssembly(Guid botBehaviourId)
    {
        var assemblyByteArray = await redisCacheService.GetDllAsync(botBehaviourId.ToString());

        return Assembly.Load(assemblyByteArray);
    }
}
