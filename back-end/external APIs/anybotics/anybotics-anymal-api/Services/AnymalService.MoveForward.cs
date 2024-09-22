
using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> MoveForwardAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. MoveForward requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "MoveForward" };
            await agentClient.CommandStream?.WriteAsync(@event);

            agentClient.Agent.General.Location.Z = agentClient.Agent.General.Location.Z - 1;
        },
        $"Performing MoveForward agent {id}.", "Agent not found.");
}
