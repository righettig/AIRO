using Microsoft.AspNetCore.Mvc;

namespace airo_bot_behaviour_compiler_microservice.Controllers
{
    public record BotBehaviourCompilerRequest(string BotBehaviourId, string BotBehaviourScript);

    [ApiController]
    [Route("[controller]")]
    public class BotBehaviourCompilerController : ControllerBase
    {
        private readonly ILogger<BotBehaviourCompilerController> _logger;

        public BotBehaviourCompilerController(ILogger<BotBehaviourCompilerController> logger)
        {
            _logger = logger;
        }

        [HttpPost("{botBehaviourId}/validate")]
        public async Task<IActionResult> IsValid([FromBody] BotBehaviourCompilerRequest request)
        {
            return Ok(true);
        }

        [HttpPost("{botBehaviourId}/compile")]
        public async Task<IActionResult> Compile([FromBody] BotBehaviourCompilerRequest request)
        {
            return Ok(true);
        }
    }
}
