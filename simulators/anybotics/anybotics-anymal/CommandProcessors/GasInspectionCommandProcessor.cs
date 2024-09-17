using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal.CommandProcessors;

public class GasInspectionCommandProcessor() : BaseCommandProcessor("GasInspection")
{
    public override void PerformCommand(AnymalAgent agent, Command response)
    {
        Console.WriteLine($"Performing gas inspection {agent.Name} (ID: {agent.Id})");
    }
}