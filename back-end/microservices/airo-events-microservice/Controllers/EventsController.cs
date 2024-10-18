using airo_common_lib.Time;
using airo_events_microservice.Domain.Read.Queries;
using airo_events_microservice.Domain.Write.Commands;
using airo_events_microservice.DTOs;
using airo_events_microservice.Services.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace airo_events_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController(IMediator mediator,
                              IRabbitMQPublisherService rabbitMQPublisherService,
                              ITimeProvider timeProvider) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
    {
        if (request.ScheduledAt < timeProvider.Now)
        {
            throw new ArgumentException("Cannot schedule an event in the past.");
        }

        var eventId = Guid.NewGuid();

        await mediator.Send(new CreateEventCommand(eventId, request.Name, request.Description, request.ScheduledAt));

        rabbitMQPublisherService.OnEventCreated(eventId, request.ScheduledAt);

        return Ok(eventId);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateEvent([FromBody] UpdateEventRequest request)
    {
        await mediator.Send(new UpdateEventCommand(request.Id, request.Name, request.Description));
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        await mediator.Send(new DeleteEventCommand(id));

        rabbitMQPublisherService.OnEventDeleted(id);

        return Ok();
    }

    [HttpPost("{id}/start")]
    public async Task<IActionResult> StartEvent(Guid id)
    {
        await mediator.Send(new StartEventCommand(id));
        return Ok();
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteEvent(Guid id, [FromBody] CompleteEventRequest request)
    {
        await mediator.Send(new CompleteEventCommand(id, request.WinnerUserId));

        rabbitMQPublisherService.OnEventCompleted(id, request.WinnerUserId);

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetEvents()
    {
        var events = await mediator.Send(new GetAllEvents());
        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEvent(Guid id)
    {
        var @event = await mediator.Send(new GetEventById(id));
        return Ok(@event);
    }
}
