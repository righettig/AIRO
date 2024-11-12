using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation;

public class SimulationConfig : ISimulationConfig
{
    public int BotHpDecayInterval { get; }
    public int FoodRespawnInterval { get; }
    public int BotHpDecayAmount { get; }
    public int BotHpRestoreAmount { get; }
    public int? TurnDelaySeconds { get; }

    public SimulationConfig(int botHpDecayInterval,
                            int foodRespawnInterval,
                            int botHpDecayAmount,
                            int botHpRestoreAmount,
                            int? turnDelaySeconds = 0)
    {
        if (botHpDecayInterval <= 0
            || foodRespawnInterval <= 0
            || botHpDecayAmount <= 0
            || botHpRestoreAmount <= 0)
        {
            throw new ArgumentException("Intervals and amounts must be greater than zero.");
        }

        if (turnDelaySeconds < 0)
        {
            throw new ArgumentException($"{nameof(turnDelaySeconds)} cannot be negative.");
        }

        BotHpDecayInterval = botHpDecayInterval;
        FoodRespawnInterval = foodRespawnInterval;
        BotHpDecayAmount = botHpDecayAmount;
        BotHpRestoreAmount = botHpRestoreAmount;
        TurnDelaySeconds = turnDelaySeconds ?? 0;
    }
}
