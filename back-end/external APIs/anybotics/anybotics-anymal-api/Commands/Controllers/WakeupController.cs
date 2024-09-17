using anybotics_anymal_api.Commands;
using anybotics_anymal_api.Commands.Core;
using anybotics_anymal_api.CustomAttributes;
using Microsoft.AspNetCore.Mvc;

namespace anybotics_anymal_api.Commands.Controllers;

[ApiController]
[Route("anymal/wakeup")]
public class WakeupController : BaseAnymalCommandController
{
    public WakeupController(ICommandBus commandBus) : base(commandBus) { }

    [HttpPost]
    [Deny("guest")]
    public async Task<IActionResult> WakeupAgent([FromBody] string id)
    {
        var validationResult = ValidateId(id);
        if (validationResult != null)
        {
            return validationResult;
        }

        var result = await commandBus.SendAsync(new WakeUpCommand(id, UserUid));
        return Ok(result);
    }
}
