using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> AcousticMeasureAsync(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == AnymalGrpc.Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. AcousticMeasure requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "AcousticMeasure" };
            await agentClient.CommandStream?.WriteAsync(@event);
        },
        $"Performing acoustic measure agent {id}.", "Agent not found.");
}
