namespace airo_event_simulation_domain.Interfaces
{
    public interface ISimulationConfig
    {
        int BotHpDecayAmount { get; }
        int BotHpDecayInterval { get; }
        int BotHpInitialAmount { get; }
        int BotHpRestoreAmount { get; }
        int FoodRespawnInterval { get; }
    }
}