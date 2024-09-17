using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal.CommandProcessors;

public class ThermalInspectionCommandProcessor() : BaseCommandProcessor("ThermalInspection")
{
    public override void PerformCommand(AnymalAgent agent, Command response)
    {
        Console.WriteLine($"Performing thermal inspection {agent.Name} (ID: {agent.Id})");
    }
}
