using airo_events_microservice.Domain.Read.Queries;
using airo_events_microservice.Domain.Write.Commands;
using airo_events_microservice.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace airo_events_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;

    public EventsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
    {
        var eventId = Guid.NewGuid();

        await _mediator.Send(new CreateEventCommand(eventId, request.Name, request.Description));

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
        return Ok();
    }

    [HttpPost("{id}/start")]
    public async Task<IActionResult> StartEvent(Guid id)
    {
        await _mediator.Send(new StartEventCommand(id));
        return Ok();
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteEvent(Guid id)
    {
        await _mediator.Send(new CompleteEventCommand(id));
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
