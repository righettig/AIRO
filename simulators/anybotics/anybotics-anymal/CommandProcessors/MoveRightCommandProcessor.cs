
using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal.CommandProcessors;

public class MoveRightCommandProcessor() : BaseCommandProcessor("MoveRight")
{
    public override void PerformCommand(AnymalAgent agent, Command response)
    {
        agent.General.Location.X = agent.General.Location.X - 1;
        Console.WriteLine($"Moving right {agent.Name} (ID: {agent.Id})");
    }
}
