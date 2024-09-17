using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> ThermalInspectionAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == AnymalGrpc.Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. ThermalInspection requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "ThermalInspection" };
            await agentClient.CommandStream?.WriteAsync(@event);
        },
        $"Performing thermal inspection agent {id}.", "Agent not found.");
}
