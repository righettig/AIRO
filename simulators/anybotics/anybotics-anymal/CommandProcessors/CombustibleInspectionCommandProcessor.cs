using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal.CommandProcessors;

public class CombustibleInspectionCommandProcessor() : BaseCommandProcessor("CombustibleInspection")
{
    public override void PerformCommand(AnymalAgent agent, Command response)
    {
        Console.WriteLine($"Performing combustible inspection {agent.Name} (ID: {agent.Id})");
    }
}
