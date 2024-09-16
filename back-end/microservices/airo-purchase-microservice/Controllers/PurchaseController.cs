using airo_purchase_microservice.Domain.Write.Commands;
using airo_purchase_microservice.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace airo_purchase_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchaseController : ControllerBase
{
    private readonly IMediator _mediator;

    public PurchaseController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> PurchaseBot([FromBody] PurchaseBotRequest request)
    {
        await _mediator.Send(new PurchaseBotCommand(request.UserId, request.UserId));

        return Ok();
    }
}
