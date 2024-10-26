using airo_events_scheduler.Jobs;
using airo_events_scheduler.Services.Interfaces;
using Quartz;
using TimeZoneConverter;

namespace airo_events_scheduler.Services.Impl;

public class QuartzJobScheduler(ISchedulerFactory schedulerFactory) : IJobScheduler
{
    public async Task ScheduleEventStart(Guid eventId, DateTime scheduledAt) 
    {
        // Grab the Scheduler instance from the Factory
        var scheduler = await schedulerFactory.GetScheduler();

        // Define the job and tie it to the MyJob class
        var job = JobBuilder.Create<StartEventJob>()
            .WithIdentity(eventId.ToString(), "StartEventJobs")
            .UsingJobData("eventId", eventId.ToString())
            .Build();

        var runTime = ToUtcDateTimeOffset(scheduledAt);

        // Create a trigger that fires at the specific time
        var trigger = TriggerBuilder.Create()
            .WithIdentity(eventId.ToString(), "StartEventJobs")
            .StartAt(runTime)
            .Build();

        // Schedule the job with the trigger
        await scheduler.ScheduleJob(job, trigger);

        Console.WriteLine($"Scheduled event start at {scheduledAt}.");
    }

    public async Task UpdateScheduleEventStart(Guid eventId, DateTime scheduledAt)
    {
        var scheduler = await schedulerFactory.GetScheduler();

        var oldTriggerKey = new TriggerKey(eventId.ToString(), "StartEventJobs");

        // Retrieve the old trigger and define a new one with the same key
        var oldTrigger = await scheduler.GetTrigger(oldTriggerKey);

        if (oldTrigger != null)
        {
            var runTime = ToUtcDateTimeOffset(scheduledAt);

            var newTrigger = TriggerBuilder.Create()
                .WithIdentity(eventId.ToString(), "StartEventJobs")
                .StartAt(runTime)
                .Build();

            // Reschedule the job with the new trigger
            await scheduler.RescheduleJob(oldTriggerKey, newTrigger);

            Console.WriteLine($"Re-scheduled event start at {scheduledAt}.");
        }
        else 
        {
            Console.WriteLine($"Could not find schedule for event: {eventId}.");
        }
    }

    public async Task DeleteScheduleEventStart(Guid eventId)
    {
        var scheduler = await schedulerFactory.GetScheduler();

        bool jobDeleted = await scheduler.DeleteJob(new JobKey(eventId.ToString(), "StartEventJobs"));

        if (jobDeleted)
        {
            Console.WriteLine("Job deleted successfully: " + eventId);
        }
        else
        {
            Console.WriteLine("Job not found: " + eventId);
        }
    }

    private static DateTimeOffset ToUtcDateTimeOffset(DateTime scheduledAt)
    {
        // Specify the DateTimeKind explicitly to ensure proper conversion
        var specifiedScheduledAt = DateTime.SpecifyKind(scheduledAt, DateTimeKind.Unspecified);

        var romeTimeZone = TimeZoneInfo.FindSystemTimeZoneById(TZConvert.IanaToWindows("Europe/Rome"));

        // Convert Rome time to UTC
        var utcDateTime = TimeZoneInfo.ConvertTimeToUtc(specifiedScheduledAt, romeTimeZone);

        // Specify a specific point in time for the trigger
        var runTime = DateBuilder.DateOf(utcDateTime.Hour,
                                         utcDateTime.Minute,
                                         utcDateTime.Second,
                                         utcDateTime.Day,
                                         utcDateTime.Month);

        return runTime;
    }

}
