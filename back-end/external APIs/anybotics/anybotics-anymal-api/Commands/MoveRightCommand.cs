
using anybotics_anymal_api.Commands.Core;

namespace anybotics_anymal_api.Commands;

public class MoveRightCommand(string agentId, string initiatedBy) : CommandBase(agentId, initiatedBy)
{
    public override string ToString() => "MoveRight";
}
