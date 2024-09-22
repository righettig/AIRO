using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class WakeupCommandHandler(AnymalService anymalService) : CommandHandlerBase<WakeUpCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(WakeUpCommand command)
    {
        return await anymalService.WakeupAsync(command.AgentId);
    }
}