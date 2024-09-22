namespace anybotics_anymal_api.Commands.Core;

public abstract class CommandBase(string agentId, string initiatedBy) : ICommand
{
    public string AgentId { get; set; } = agentId;
    public string InitiatedBy { get; set; } = initiatedBy;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
