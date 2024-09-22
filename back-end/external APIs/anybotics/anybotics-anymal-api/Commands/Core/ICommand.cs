namespace anybotics_anymal_api.Commands.Core;

public interface ICommand
{
    string AgentId { get; set; }
    string InitiatedBy { get; set; }
    DateTime Timestamp { get; set; }
}
