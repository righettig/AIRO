namespace airo_event_simulation_domain.Interfaces
{
    public interface ISimulationConfig
    {
        int BotHpDecayAmount { get; }
        int BotHpDecayInterval { get; }
        int BotHpInitialAmount { get; }
        int BotHpRestoreAmount { get; }
        int FoodRespawnInterval { get; }

        /// <summary>
        /// How many seconds to wait before the next behaviour is evaluated. 
        /// This is useful to slow down the simulation.
        /// </summary>
        int? TurnDelaySeconds { get; }
    }
}