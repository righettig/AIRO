namespace airo_bots_microservice.Controllers;

//using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class BotController : ControllerBase
{
    //private readonly IMediator _mediator;

    //public BotController(IMediator mediator)
    public BotController()
    {
        //_mediator = mediator;
    }

    //[HttpPost]
    //public async Task<IActionResult> CreateBot(CreateBotCommand command)
    //{
    //    var id = await _mediator.Send(command);
    //    return Ok(id);
    //}

    [HttpGet]
    public async Task<IActionResult> GetBots()
    {
        //var bots = await _mediator.Send(new GetBotsQuery());
        //return Ok(bots);
        return Ok();
    }
}
