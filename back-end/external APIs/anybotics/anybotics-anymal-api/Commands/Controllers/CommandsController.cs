using anybotics_anymal_api.Commands.Core;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace anybotics_anymal_api.Commands.Controllers;

[ApiController]
[Route("[controller]")]
public class CommandsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<string>> GetAvailableCommands()
    {
        var commandTypes = Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => typeof(ICommand).IsAssignableFrom(t) && t.IsClass && !t.IsAbstract)
            .Select(t => t.Name)
            .ToList();

        return Ok(commandTypes);
    }
}
