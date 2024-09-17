
using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class MoveLeftCommandHandler(AnymalService anymalService) : CommandHandlerBase<MoveLeftCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(MoveLeftCommand command)
    {
        return await anymalService.MoveLeftAsync(command.AgentId);
    }
}
