using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;

namespace airo_event_simulation_engine.Impl;

public class InMemorySimulationRepository : ISimulationRepository
{
    private readonly Dictionary<Guid, ISimulation> simulations = [];

    public ISimulation GetByEventId(Guid eventId)
    {
        return simulations[eventId];
    }

    public Task Save(ISimulation simulation)
    {
        if (!simulations.ContainsKey(simulation.EventId))
        {
            simulations.Add(simulation.EventId, simulation);
        }
        else 
        {
            simulations[simulation.EventId] = simulation;
        }      

        return Task.CompletedTask;
    }
}
