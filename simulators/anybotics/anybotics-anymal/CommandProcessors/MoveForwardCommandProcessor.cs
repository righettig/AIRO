
using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal.CommandProcessors;

public class MoveForwardCommandProcessor() : BaseCommandProcessor("MoveForward")
{
    public override void PerformCommand(AnymalAgent agent, Command response)
    {
        agent.General.Location.Z = agent.General.Location.Z - 1;
        Console.WriteLine($"Moving forward {agent.Name} (ID: {agent.Id})");
    }
}
