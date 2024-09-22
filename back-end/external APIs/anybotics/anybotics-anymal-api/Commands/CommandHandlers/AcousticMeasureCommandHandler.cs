using anybotics_anymal_api.Commands.Core;
using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class AcousticMeasureCommandHandler(AnymalService anymalService) : CommandHandlerBase<AcousticMeasureCommand>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(AcousticMeasureCommand command)
    {
        return await anymalService.AcousticMeasureAsync(command.AgentId);
    }
}