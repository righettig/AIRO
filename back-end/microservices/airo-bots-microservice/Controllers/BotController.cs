using airo_bots_microservice.Application.Commands;
using airo_bots_microservice.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace airo_bots_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BotController : ControllerBase
{
    private readonly IMediator _mediator;

    public BotController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBot(CreateBotCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBot(Guid id)
    {
        await _mediator.Send(new DeleteBotCommand(id));
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetBots()
    {
        var bots = await _mediator.Send(new GetBotsQuery());
        return Ok(bots);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBot(Guid id)
    {
        var bot = await _mediator.Send(new GetBotQuery(id));
        return Ok(bot);
    }
}
