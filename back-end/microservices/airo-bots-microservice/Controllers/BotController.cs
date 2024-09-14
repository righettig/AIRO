using airo_bots_microservice.Domain.Read.Queries;
using airo_bots_microservice.Domain.Write.Commands;
using airo_bots_microservice.DTOs;
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
    public async Task<IActionResult> CreateBot([FromBody] CreateBotRequest request)
    {
        var botId = Guid.NewGuid();

        await _mediator.Send(new CreateBotCommand(botId, request.Name, request.Price));

        return Ok(botId);
    }

    //[HttpDelete("{id}")]
    //public async Task<IActionResult> DeleteBot(Guid id)
    //{
    //    await _mediator.Send(new DeleteBotCommand(id));
    //    return NoContent();
    //}

    //[HttpGet]
    //public async Task<IActionResult> GetBots()
    //{
    //    var bots = await _mediator.Send(new GetBotsQuery());
    //    return Ok(bots);
    //}

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBot(Guid id)
    {
        var bot = await _mediator.Send(new GetBotById(id));
        return Ok(bot);
    }
}
