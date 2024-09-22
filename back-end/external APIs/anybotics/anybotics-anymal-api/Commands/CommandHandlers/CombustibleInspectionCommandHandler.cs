using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class CombustibleInspectionCommandHandler(AnymalService anymalService) : CommandHandlerBase<CombustibleInspectionCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(CombustibleInspectionCommand command)
    {
        return await anymalService.CombustibleInspectionAsync(command.AgentId);
    }
}
