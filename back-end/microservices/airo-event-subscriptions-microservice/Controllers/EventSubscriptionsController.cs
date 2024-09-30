using airo_event_subscriptions_domain.Domain.Read.Queries;
using airo_event_subscriptions_domain.Domain.Write.Commands;
using airo_event_subscriptions_microservice.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace airo_event_subscriptions_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventSubscriptionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public EventSubscriptionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBot([FromBody] SubscribeToEventRequest request)
    {
        await _mediator.Send(new SubscribeToEventCommand(request.UserId, request.EventId, request.BotId));
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> UpdateBot([FromBody] UnsubscribeFromEventRequest request)
    {
        await _mediator.Send(new UnsubscribeFromEventCommand(request.UserId, request.EventId));
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetEventParticipants([FromQuery] Guid eventId)
    {
        var participants = await _mediator.Send(new GetEventParticipants(eventId));
        return Ok(participants);
    }
}
