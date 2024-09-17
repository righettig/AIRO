using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class GasInspectionCommandHandler(AnymalService anymalService) : CommandHandlerBase<GasInspectionCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(GasInspectionCommand command)
    {
        return await anymalService.GasInspectionAsync(command.AgentId);
    }
}
