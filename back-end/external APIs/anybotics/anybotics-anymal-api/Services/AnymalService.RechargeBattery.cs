using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> RechargeBatteryAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == AnymalGrpc.Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. Recharge requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "RechargeBattery" };
            await agentClient.CommandStream?.WriteAsync(@event);

            agentClient.Agent.BatteryLevel = 100;
            agentClient.Agent.Status = AnymalGrpc.Status.Active;
        },
        $"Recharged agent {id} to 100%.", "Agent not found.");
}
