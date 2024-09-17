using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> WakeupAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == AnymalGrpc.Status.Unavailable ||
                agentClient.Agent.Status == AnymalGrpc.Status.Active)
            {
                throw new InvalidOperationException("Agent is either already Active or Unavailable. Wake up requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "Wakeup" };
            await agentClient.CommandStream?.WriteAsync(@event);

            agentClient.Agent.Status = AnymalGrpc.Status.Active;
        },
        $"Waking up agent {id}.", "Agent not found.");
}
