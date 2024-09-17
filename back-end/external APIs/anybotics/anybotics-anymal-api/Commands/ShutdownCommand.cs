using anybotics_anymal_api.Commands.Core;

namespace anybotics_anymal_api.Commands;

public class ShutdownCommand(string agentId, string initiatedBy) : CommandBase(agentId, initiatedBy)
{
    public override string ToString() => "Shutdown";
}
