using anybotics_anymal_common.Domain;
using AnymalGrpc;

namespace anybotics_anymal.CommandProcessors;

public abstract class BaseCommandProcessor(string commandId) : ICommandProcessor
{
    public string CommandId { get; } = commandId;

    public virtual bool ConditionCheck(AnymalAgent agent) => agent.Status == Status.Active;

    public abstract void PerformCommand(AnymalAgent agent, Command response);
}