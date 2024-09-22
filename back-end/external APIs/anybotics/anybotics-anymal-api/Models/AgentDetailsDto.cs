using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal_api.Models;

public class AgentDetailsDto
{
    private IOrderedEnumerable<CommandHistoryItem> commandHistoryItems;

    public string Id { get; set; }
    public string Name { get; set; }
    public int BatteryLevel { get; set; }
    public Status Status { get; set; }
    public GeneralInfo General { get; set; }
    public HardwareInfo Hardware { get; set; }
    public List<string> RecentImages { get; set; }
    public List<CommandHistoryItem> CommandHistory { get; set; }
    public List<StatusHistoryItem> StatusHistory { get; set; }

    public AgentDetailsDto(AnymalAgent agent, IOrderedEnumerable<CommandHistoryItem> commandHistoryItems)
    {
        Id = agent.Id;
        Name = agent.Name;
        BatteryLevel = agent.BatteryLevel;
        Status = agent.Status;
        General = agent.General;
        Hardware = agent.Hardware;
        RecentImages = agent.RecentImages;
        CommandHistory = [.. commandHistoryItems];
        StatusHistory =
                [
                    new StatusHistoryItem
                    {
                        Timestamp = new DateTime(2024, 8, 10, 8, 0, 0, DateTimeKind.Utc),
                        Status = AnymalGrpc.Status.Active
                    },
                    new StatusHistoryItem
                    {
                        Timestamp = new DateTime(2024, 8, 11, 9, 30, 0, DateTimeKind.Utc),
                        Status = AnymalGrpc.Status.Offline
                    },
                    new StatusHistoryItem
                    {
                        Timestamp = new DateTime(2024, 8, 12, 10, 45, 0, DateTimeKind.Utc),
                        Status = AnymalGrpc.Status.Unavailable
                    },
                    new StatusHistoryItem
                    {
                        Timestamp = new DateTime(2024, 8, 13, 11, 50, 0, DateTimeKind.Utc),
                        Status = AnymalGrpc.Status.Active
                    }
                ];
    }
}

public class CommandHistoryItem
{
    public string InitiatedBy { get; set; }
    public DateTime Timestamp { get; set; }
    public string Description { get; set; }
}

public class StatusHistoryItem
{
    public DateTime Timestamp { get; set; }
    public Status Status { get; set; }
}
