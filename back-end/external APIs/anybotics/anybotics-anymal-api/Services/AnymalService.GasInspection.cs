using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> GasInspectionAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == AnymalGrpc.Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. GasInspection requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "GasInspection" };
            await agentClient.CommandStream?.WriteAsync(@event);
        },
        $"Performing gas inspection agent {id}.", "Agent not found.");
}
