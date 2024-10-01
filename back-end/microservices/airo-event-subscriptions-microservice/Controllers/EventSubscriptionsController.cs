using airo_event_subscriptions_domain.Domain.Read.Queries;
using airo_event_subscriptions_domain.Domain.Write.Commands;
using airo_event_subscriptions_microservice.DTOs;
using airo_event_subscriptions_microservice.Services.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace airo_event_subscriptions_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventSubscriptionsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IPurchaseService _purchaseService;
    private readonly IRabbitMQPublisherService _rabbitMQPublisherService;

    public EventSubscriptionsController(IMediator mediator,
                                        IPurchaseService purchaseService,
                                        IRabbitMQPublisherService rabbitMQPublisherService)
    {
        _mediator = mediator;
        _purchaseService = purchaseService;
        _rabbitMQPublisherService = rabbitMQPublisherService;
    }

    [HttpPost]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeToEventRequest request)
    {
        // Bot Ownership Verification: Ensure the user cannot subscribe using a bot they don’t own.
        bool ownsBot = await _purchaseService.OwnsBot(request.UserId, request.BotId);

        if (!ownsBot) 
        {
            throw new InvalidOperationException($"The user {request.UserId} does not own the specified bot {request.BotId}");
        }

        await _mediator.Send(new SubscribeToEventCommand(request.UserId, request.EventId, request.BotId));

        _rabbitMQPublisherService.OnEventSubscribed(request.UserId, request.EventId);

        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> Unsubscribe([FromBody] UnsubscribeFromEventRequest request)
    {
        await _mediator.Send(new UnsubscribeFromEventCommand(request.UserId, request.EventId));

        _rabbitMQPublisherService.OnEventUnsubscribed(request.UserId, request.EventId);

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetEventParticipants([FromQuery] Guid eventId)
    {
        var participants = await _mediator.Send(new GetEventParticipants(eventId));

        return Ok(participants);
    }
}
