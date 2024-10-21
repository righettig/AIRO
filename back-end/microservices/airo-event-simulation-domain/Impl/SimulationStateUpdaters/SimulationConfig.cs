namespace airo_event_simulation_domain.Impl.SimulationStateUpdaters;

public class SimulationConfig
{
    public int BotHpDecayInterval { get; }
    public int FoodRespawnInterval { get; }
    public int BotHpDecayAmount { get; }
    public int BotHpRestoreAmount { get; }

    public SimulationConfig(int botHpDecayInterval, int foodRespawnInterval, int botHpDecayAmount, int botHpRestoreAmount)
    {
        if (botHpDecayInterval <= 0 || foodRespawnInterval <= 0 || botHpDecayAmount <= 0 || botHpRestoreAmount <= 0)
        {
            throw new ArgumentException("Intervals and amounts must be greater than zero.");
        }

        BotHpDecayInterval = botHpDecayInterval;
        FoodRespawnInterval = foodRespawnInterval;
        BotHpDecayAmount = botHpDecayAmount;
        BotHpRestoreAmount = botHpRestoreAmount;
    }
}
