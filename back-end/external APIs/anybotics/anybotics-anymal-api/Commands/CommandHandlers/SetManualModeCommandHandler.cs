using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class SetManualModeCommandHandler(AnymalService anymalService) : CommandHandlerBase<SetManualModeCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(SetManualModeCommand command)
    {
        return await anymalService.SetManualModeAsync(command.AgentId, command.ManualMode);
    }
}
