using anybotics_anymal_api.Commands.Core;
using Microsoft.AspNetCore.Mvc;

namespace anybotics_anymal_api.Commands.Controllers;

public abstract class BaseAnymalCommandController(ICommandBus commandBus) : ControllerBase
{
    protected readonly ICommandBus commandBus = commandBus;

    protected string? UserUid => HttpContext.Items["UserUid"] as string;

    protected IActionResult ValidateId(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return BadRequest("Invalid id.");
        }

        return null!;
    }
}
