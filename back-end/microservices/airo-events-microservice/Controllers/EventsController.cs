using airo_events_microservice.Domain.Read.Queries;
using airo_events_microservice.Domain.Write.Commands;
using airo_events_microservice.DTOs;
using airo_events_microservice.Services.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace airo_events_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IRabbitMQPublisherService _rabbitMQPublisherService;

    public EventsController(IMediator mediator, IRabbitMQPublisherService rabbitMQPublisherService)
    {
        _mediator = mediator;
        _rabbitMQPublisherService = rabbitMQPublisherService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
    {
        if (request.ScheduledAt < DateTime.Now) // TODO: introduce ITimeProvider
        {
            throw new ArgumentException("Cannot schedule an event in the past.");
        }

        var eventId = Guid.NewGuid();

        await _mediator.Send(new CreateEventCommand(eventId, request.Name, request.Description, request.ScheduledAt));

        _rabbitMQPublisherService.OnEventCreated(eventId, request.ScheduledAt);

        return Ok(eventId);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateEvent([FromBody] UpdateEventRequest request)
    {
        await _mediator.Send(new UpdateEventCommand(request.Id, request.Name, request.Description));
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        await _mediator.Send(new DeleteEventCommand(id));

        _rabbitMQPublisherService.OnEventDeleted(id);

        return Ok();
    }

    [HttpPost("{id}/start")]
    public async Task<IActionResult> StartEvent(Guid id)
    {
        await _mediator.Send(new StartEventCommand(id));
        return Ok();
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteEvent(Guid id, [FromBody] CompleteEventRequest request)
    {
        await _mediator.Send(new CompleteEventCommand(id, request.WinnerUserId));

        _rabbitMQPublisherService.OnEventCompleted(id, request.WinnerUserId);

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetEvents()
    {
        var events = await _mediator.Send(new GetAllEvents());
        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEvent(Guid id)
    {
        var @event = await _mediator.Send(new GetEventById(id));
        return Ok(@event);
    }
}
