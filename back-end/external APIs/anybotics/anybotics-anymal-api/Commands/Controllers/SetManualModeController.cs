using anybotics_anymal_api.Commands.Core;
using anybotics_anymal_api.CustomAttributes;
using Microsoft.AspNetCore.Mvc;

namespace anybotics_anymal_api.Commands.Controllers;

public class SetManualModeRequest
{
    public string Id { get; set; }
    public bool ManualMode { get; set; }
}

[ApiController]
[Route("anymal/setManualMode")]
public class SetManualModeController(ICommandBus commandBus) : BaseAnymalCommandController(commandBus)
{
    [HttpPost]
    [Deny("guest")]
    public async Task<IActionResult> SetManualMode([FromBody] SetManualModeRequest request)
    {
        var validationResult = ValidateId(request.Id);
        if (validationResult != null)
        {
            return validationResult;
        }

        var result = await commandBus.SendAsync(new SetManualModeCommand(request.Id, UserUid, request.ManualMode));
        return Ok(result);
    }
}
