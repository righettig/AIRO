using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_engine.Interfaces;

public interface IBehaviourExecutor
{
    Task<ISimulationAction> Execute(IBotAgent botAgent, IBotState state, CancellationToken token);
}
