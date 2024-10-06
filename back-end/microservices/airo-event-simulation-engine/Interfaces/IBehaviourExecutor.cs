namespace airo_event_simulation_engine.Interfaces;

public interface IBehaviourExecutor
{
    Task Execute(string behaviorScript, CancellationToken token);
}
