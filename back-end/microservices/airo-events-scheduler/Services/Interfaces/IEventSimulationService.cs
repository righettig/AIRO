namespace airo_events_scheduler.Services.Interfaces;

public interface IEventSimulationService
{
    Task StartEventAsync(string eventId);
}
