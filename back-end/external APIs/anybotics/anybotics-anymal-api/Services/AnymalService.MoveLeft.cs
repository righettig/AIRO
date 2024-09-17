
using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> MoveLeftAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. MoveLeft requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "MoveLeft" };
            await agentClient.CommandStream?.WriteAsync(@event);

            agentClient.Agent.General.Location.X = agentClient.Agent.General.Location.X + 1;
        },
        $"Performing MoveLeft agent {id}.", "Agent not found.");
}
