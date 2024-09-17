using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class RechargeBatteryCommandHandler(AnymalService anymalService) : CommandHandlerBase<RechargeBatteryCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(RechargeBatteryCommand command)
    {
        return await anymalService.RechargeBatteryAsync(command.AgentId);
    }
}
