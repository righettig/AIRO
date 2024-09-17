
using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class MoveBackwardCommandHandler(AnymalService anymalService) : CommandHandlerBase<MoveBackwardCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(MoveBackwardCommand command)
    {
        return await anymalService.MoveBackwardAsync(command.AgentId);
    }
}
