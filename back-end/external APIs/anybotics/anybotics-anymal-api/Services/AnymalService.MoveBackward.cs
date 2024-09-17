
using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> MoveBackwardAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. MoveBackward requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "MoveBackward" };
            await agentClient.CommandStream?.WriteAsync(@event);

            agentClient.Agent.General.Location.Z = agentClient.Agent.General.Location.Z + 1;
        },
        $"Performing MoveBackward agent {id}.", "Agent not found.");
}
