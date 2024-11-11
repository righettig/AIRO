using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation.Actions;

public class AttackAction(Guid enemyId) : ISimulationAction
{
    public Guid EnemyId { get; } = enemyId;

    public override string ToString() => "Attack";
}