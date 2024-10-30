namespace airo_events_scheduler.Services.Interfaces;

public interface IJobScheduler
{
    Task ScheduleEventStart(Guid eventId, DateTime scheduledAt);
    Task UpdateScheduleEventStart(Guid eventId, DateTime scheduledAt);
    Task DeleteScheduleEventStart(Guid eventId);
}
