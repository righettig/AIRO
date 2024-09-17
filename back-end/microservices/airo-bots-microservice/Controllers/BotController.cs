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

    [HttpPut]
    public async Task<IActionResult> UpdateBot([FromBody] UpdateBotRequest request)
    {
        await _mediator.Send(new UpdateBotCommand(request.Id, request.Name, request.Price));
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBot(Guid id)
    {
        await _mediator.Send(new DeleteBotCommand(id));
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetBots([FromQuery] Guid[]? ids = null)
    {
        if (ids == null || ids.Length == 0)
        {
            var bots = await _mediator.Send(new GetAllBots());
            return Ok(bots);
        }
        else
        {
            var bots = await _mediator.Send(new GetBotsByIds(ids));
            return Ok(bots);
        }
    }
}
