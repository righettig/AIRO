using anybotics_anymal_api.Commands.Core;
using anybotics_anymal_api.CustomAttributes;
using Microsoft.AspNetCore.Mvc;

namespace anybotics_anymal_api.Commands.Controllers;

[ApiController]
[Route("anymal/shutdown")]
public class ShutdownController(ICommandBus commandBus) : BaseAnymalCommandController(commandBus)
{
    [HttpPost]
    [Deny("guest")]
    public async Task<IActionResult> Shutdown([FromBody] string id)
    {
        var validationResult = ValidateId(id);
        if (validationResult != null)
        {
            return validationResult;
        }

        var result = await commandBus.SendAsync(new ShutdownCommand(id, UserUid));
        return Ok(result);
    }
}
