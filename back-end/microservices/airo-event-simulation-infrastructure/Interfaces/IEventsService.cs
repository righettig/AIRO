namespace airo_event_simulation_infrastructure.Interfaces;

public interface IEventsService
{
    Task<Guid> GetMapId(Guid eventId);
    Task MarkEventAsStartedAsync(Guid eventId);
    Task MarkEventAsCompletedAsync(Guid eventId, string? winnerUserId = null);
}
