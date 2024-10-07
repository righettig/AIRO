namespace airo_event_simulation_infrastructure.Interfaces;

public interface IBotBehavioursService
{
    Task<string> GetBotBehaviour(Guid botBehaviourId);
}
