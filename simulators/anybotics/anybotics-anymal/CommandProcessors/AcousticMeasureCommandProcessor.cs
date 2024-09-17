using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal.CommandProcessors;

public class AcousticMeasureCommandProcessor() : BaseCommandProcessor("AcousticMeasure")
{
    public override void PerformCommand(AnymalAgent agent, Command response)
    {
        Console.WriteLine($"Performing acoustic measure {agent.Name} (ID: {agent.Id})");
    }
}
