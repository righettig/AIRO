namespace airo_event_simulation_microservice.Interfaces;

public interface IEventsService
{
    Task MarkEventAsStartedAsync(Guid eventId);
    Task MarkEventAsCompletedAsync(Guid eventId);
}
