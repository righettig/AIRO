using anybotics_anymal_api.Commands.Core;

namespace anybotics_anymal_api.Commands;

public class SetManualModeCommand(string agentId, string initiatedBy, bool manualMode) : CommandBase(agentId, initiatedBy)
{
    public bool ManualMode { get; } = manualMode;

    public override string ToString() => "SetManualMode";
}
