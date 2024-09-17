using airo_purchase_microservice.Domain.Read.Queries;
using airo_purchase_microservice.Domain.Write.Commands;
using airo_purchase_microservice.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

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
        Guid userIdGuid = GetUserGuid(request.UserId);

        await _mediator.Send(new PurchaseBotCommand(userIdGuid, request.BotId));

        return Ok();
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetPurchasedBotsByUserId(string userId)
    {
        Guid userIdGuid = GetUserGuid(userId);

        var bots = await _mediator.Send(new GetPurchasedBotsByUserId(userIdGuid));
        return Ok(bots);
    }

    // to allow unit tests
    protected virtual Guid GetUserGuid(string userId)
    {
        var hash = MD5.HashData(Encoding.UTF8.GetBytes(userId));

        // Create a GUID from the MD5 hash
        var userIdGuid = new Guid(hash);
        return userIdGuid;
    }
}
