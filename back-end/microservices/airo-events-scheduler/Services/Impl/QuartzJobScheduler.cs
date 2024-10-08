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

        var romeTimeZone = TimeZoneInfo.FindSystemTimeZoneById(TZConvert.IanaToWindows("Europe/Rome"));

        // Convert Rome time to UTC
        var utcDateTime = TimeZoneInfo.ConvertTimeToUtc(scheduledAt, romeTimeZone);

        // Specify a specific point in time for the trigger
        var runTime = DateBuilder.DateOf(utcDateTime.Hour,
                                         utcDateTime.Minute,
                                         utcDateTime.Second,
                                         utcDateTime.Day,
                                         utcDateTime.Month);

        Console.WriteLine("DEBUG: " + runTime.ToString());

        // Create a trigger that fires at the specific time
        var trigger = TriggerBuilder.Create()
            .WithIdentity(eventId.ToString(), "StartEventJobs")
            .StartAt(runTime)
            .Build();

        // Schedule the job with the trigger
        await scheduler.ScheduleJob(job, trigger);

        Console.WriteLine($"Scheduled event start at {scheduledAt}.");
    }
}
