using AnymalGrpc;
using Google.Protobuf.WellKnownTypes;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> SetManualModeAsync(string id, bool manualMode)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == AnymalGrpc.Status.Unavailable)
            {
                throw new InvalidOperationException("Agent is Unavailable. Set manual mode requests are ignored.");
            }

            var payload = new SetManualModeRequest { ManualMode = manualMode };
            var @event = new Command { Id = id, CommandId = "SetManualMode", Payload = Any.Pack(payload) };
            await agentClient.CommandStream?.WriteAsync(@event);

            agentClient.Agent.General.ManualModeOn = manualMode;
        },
        $"Setting up manual mode for agent {id} with value {manualMode}", "Agent not found.");
}
