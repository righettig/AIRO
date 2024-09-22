using anybotics_anymal_api.Commands.Core;
using anybotics_anymal_api.CustomAttributes;
using Microsoft.AspNetCore.Mvc;

namespace anybotics_anymal_api.Commands.Controllers;

[ApiController]
[Route("anymal/acousticMeasure")]
public class AcousticMeasureController(ICommandBus commandBus) : BaseAnymalCommandController(commandBus)
{
    [HttpPost]
    [Deny("guest")]
    public async Task<IActionResult> AcousticMeasure([FromBody] string id)
    {
        var validationResult = ValidateId(id);
        if (validationResult != null)
        {
            return validationResult;
        }

        var result = await commandBus.SendAsync(new AcousticMeasureCommand(id, UserUid));
        return Ok(result);
    }
}