
using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> MoveRightAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. MoveRight requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "MoveRight" };
            await agentClient.CommandStream?.WriteAsync(@event);

            agentClient.Agent.General.Location.X = agentClient.Agent.General.Location.X - 1;
        },
        $"Performing MoveRight agent {id}.", "Agent not found.");
}
