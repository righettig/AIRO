using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation;

public class SimulationConfig : ISimulationConfig
{
    public int BotHpInitialAmount { get; }
    public int BotHpDecayInterval { get; }
    public int FoodRespawnInterval { get; }
    public int BotHpDecayAmount { get; }
    public int BotHpRestoreAmount { get; }

    public SimulationConfig(int botHpInitialAmount, int botHpDecayInterval, int foodRespawnInterval, int botHpDecayAmount, int botHpRestoreAmount)
    {
        if (botHpInitialAmount <= 0
            || botHpDecayInterval <= 0
            || foodRespawnInterval <= 0
            || botHpDecayAmount <= 0
            || botHpRestoreAmount <= 0)
        {
            throw new ArgumentException("Intervals and amounts must be greater than zero.");
        }

        BotHpInitialAmount = botHpInitialAmount;
        BotHpDecayInterval = botHpDecayInterval;
        FoodRespawnInterval = foodRespawnInterval;
        BotHpDecayAmount = botHpDecayAmount;
        BotHpRestoreAmount = botHpRestoreAmount;
    }
}
