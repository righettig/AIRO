using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_engine.Interfaces
{
    public interface IBehaviourCompiler
    {
        Task<IBotAgent> Compile(string behaviorScript, CancellationToken token);
    }
}