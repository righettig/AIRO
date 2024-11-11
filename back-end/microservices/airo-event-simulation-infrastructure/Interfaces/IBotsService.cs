namespace airo_event_simulation_infrastructure.Interfaces;

public class BotDto 
{
    public Guid Id { get; init; }
    public int Health { get; init; }
    public int Attack { get; init; }
    public int Defense { get; init; }
}

public interface IBotsService
{
    Task<BotDto> GetBotById(Guid botId);
}