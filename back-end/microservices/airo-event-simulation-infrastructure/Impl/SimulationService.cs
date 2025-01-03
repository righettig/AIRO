﻿using airo_event_simulation_domain.Impl;
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
                               IMapFactory mapFactory,
                               IEventSubscriptionService eventSubscriptionService,
                               IEventsService eventsService,
                               IMapsService mapsService,
                               IBotsService botsService) : ISimulationService
{
    public async Task<ISimulation> LoadSimulation(Guid eventId)
    {
        var mapId = await eventsService.GetMapId(eventId);
        var mapString = await mapsService.GetMapById(mapId);

        var participants = await Task.WhenAll(
            (await eventSubscriptionService.GetParticipants(eventId))
                .Select(async (x) => {
                    var botDto = await botsService.GetBotById(x.BotId);
                    var assembly = await GetBotBehaviourAssembly(x.BotBehaviourId);

                    var botAgent = botAgentFactory.Create(assembly);

                    var bot = new Bot(botDto.Id, botDto.Health, botDto.Attack, botDto.Defense, botAgent);

                    return new Participant(x.UserId, bot);
                })
            );

        var map = mapFactory.FromString(mapString);

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
