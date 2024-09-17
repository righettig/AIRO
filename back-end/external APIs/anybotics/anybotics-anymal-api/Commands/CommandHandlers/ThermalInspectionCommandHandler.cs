using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class ThermalInspectionCommandHandler(AnymalService anymalService) : CommandHandlerBase<ThermalInspectionCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(ThermalInspectionCommand command)
    {
        return await anymalService.ThermalInspectionAsync(command.AgentId);
    }
}
