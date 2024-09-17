
using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class MoveForwardCommandHandler(AnymalService anymalService) : CommandHandlerBase<MoveForwardCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(MoveForwardCommand command)
    {
        return await anymalService.MoveForwardAsync(command.AgentId);
    }
}
