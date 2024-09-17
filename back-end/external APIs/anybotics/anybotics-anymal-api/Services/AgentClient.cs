using anybotics_anymal_common.Domain;
using AnymalGrpc;
using Grpc.Core;

namespace anybotics_anymal_api.Services;

public class AgentClient
{
    public required AnymalAgent Agent { get; set; }
    public IServerStreamWriter<Command>? CommandStream { get; set; }
}
