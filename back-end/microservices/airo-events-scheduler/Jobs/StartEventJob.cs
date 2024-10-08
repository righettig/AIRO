using airo_events_scheduler.Services.Interfaces;
using Quartz;

namespace airo_events_scheduler.Jobs;

public class StartEventJob(IEventSimulationService eventSimulationService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        Console.WriteLine($"Job executed at: {DateTime.Now}");

        var eventId = context.JobDetail.JobDataMap.GetString("eventId");
        if (string.IsNullOrEmpty(eventId))
        {
            Console.WriteLine("No eventId provided for the job.");
            return;
        }

        await eventSimulationService.StartEventAsync(eventId);

        Console.WriteLine($"Event {eventId} simulation started.");
    }
}