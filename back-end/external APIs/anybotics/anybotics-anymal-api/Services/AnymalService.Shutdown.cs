using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> ShutdownAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == AnymalGrpc.Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. Shutdown requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "Shutdown" };
            await agentClient.CommandStream?.WriteAsync(@event);

            agentClient.Agent.Status = AnymalGrpc.Status.Offline;
        },
        $"Shutting down agent {id}.", "Agent not found.");
}
