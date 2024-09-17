using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal.CommandProcessors;

public class SetManualModeCommandProcessor() : BaseCommandProcessor("SetManualMode")
{
    public override void PerformCommand(AnymalAgent agent, Command response)
    {
        var payload = response.Payload.Unpack<SetManualModeRequest>();

        agent.General.ManualModeOn = payload.ManualMode;
        Console.WriteLine($"Setting up manual mode for {agent.Name} (ID: {agent.Id}) with value {agent.General.ManualModeOn}");
    }
}
