
using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class MoveRightCommandHandler(AnymalService anymalService) : CommandHandlerBase<MoveRightCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(MoveRightCommand command)
    {
        return await anymalService.MoveRightAsync(command.AgentId);
    }
}
