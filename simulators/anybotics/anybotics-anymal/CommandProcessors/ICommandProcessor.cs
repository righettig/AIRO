using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal.CommandProcessors;

public interface ICommandProcessor
{
    string CommandId { get; }
    bool ConditionCheck(AnymalAgent agent);
    void PerformCommand(AnymalAgent agent, Command response);
}
