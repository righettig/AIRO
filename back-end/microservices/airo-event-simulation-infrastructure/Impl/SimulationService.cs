using airo_event_simulation_domain;
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
                    var behaviorScript = await botBehavioursRepository.GetBotBehaviour(x.Item1, x.Item2);

                    var bot = new Bot(botId: x.Item2, behaviorScript);

                    return new Participant(UserId: x.Item1, bot);
                })
            );

        var simulation = new Simulation(eventId, participants);

        return simulation;
    }
}
