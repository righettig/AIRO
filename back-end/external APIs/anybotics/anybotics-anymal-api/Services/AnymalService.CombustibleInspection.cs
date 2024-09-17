using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> CombustibleInspectionAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == AnymalGrpc.Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. CombustibleInspection requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "CombustibleInspection" };
            await agentClient.CommandStream?.WriteAsync(@event);
        },
        $"Performing combustible inspection agent {id}.", "Agent not found.");
}
