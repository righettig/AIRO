using airo_events_microservice.Controllers;
using airo_events_microservice.Domain.Read;
using airo_events_microservice.Domain.Read.Queries;
using airo_events_microservice.Domain.Write.Commands;
using airo_events_microservice.DTOs;
using airo_events_microservice.Services.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace airo_events_tests;

public class EventsControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly Mock<IRabbitMQPublisherService> _rabbitMQPublisherServiceMock;
    private readonly EventsController _controller;

    public EventsControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _rabbitMQPublisherServiceMock = new Mock<IRabbitMQPublisherService>();

        _controller = new EventsController(_mediatorMock.Object, _rabbitMQPublisherServiceMock.Object);
    }

    [Fact]
    public async Task CreateEvent_ShouldReturnOkWithEventId()
    {
        // Arrange
        var request = new CreateEventRequest(Name: "Test Event", Description: "Test Description", ScheduledAt: DateTime.Now);
        var eventId = Guid.NewGuid();
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<CreateEventCommand>(), default))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.CreateEvent(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(eventId.GetType(), okResult.Value.GetType());
        _mediatorMock.Verify(m => m.Send(It.IsAny<CreateEventCommand>(), default), Times.Once);
    }

    [Fact]
    public async Task UpdateEvent_ShouldReturnOk()
    {
        // Arrange
        var request = new UpdateEventRequest(Id: Guid.NewGuid(), Name: "Updated Event", Description: "Updated Description");
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<UpdateEventCommand>(), default))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.UpdateEvent(request);

        // Assert
        var okResult = Assert.IsType<OkResult>(result);
        _mediatorMock.Verify(m => m.Send(It.IsAny<UpdateEventCommand>(), default), Times.Once);
    }

    [Fact]
    public async Task DeleteEvent_ShouldReturnOk()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<DeleteEventCommand>(), default))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.DeleteEvent(eventId);

        // Assert
        var okResult = Assert.IsType<OkResult>(result);
        _mediatorMock.Verify(m => m.Send(It.Is<DeleteEventCommand>(c => c.Id == eventId), default), Times.Once);
    }

    [Fact]
    public async Task GetEvents_ShouldReturnOkWithEvents()
    {
        // Arrange
        var events = new List<EventReadModel>
        {
            new EventReadModel { Id = Guid.NewGuid(), Name = "Event 1", Description = "Description 1" },
            new EventReadModel { Id = Guid.NewGuid(), Name = "Event 2", Description = "Description 2" }
        };
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<GetAllEvents>(), default))
            .ReturnsAsync(events);

        // Act
        var result = await _controller.GetEvents();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnEvents = Assert.IsType<List<EventReadModel>>(okResult.Value);
        Assert.Equal(2, returnEvents.Count);
        _mediatorMock.Verify(m => m.Send(It.IsAny<GetAllEvents>(), default), Times.Once);
    }

    [Fact]
    public async Task GetEvent_ShouldReturnOkWithEvent()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var eventDto = new EventReadModel
        {
            Id = eventId,
            Name = "Event Name",
            Description = "Event Description"
        };
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<GetEventById>(), default))
            .ReturnsAsync(eventDto);

        // Act
        var result = await _controller.GetEvent(eventId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedEvent = Assert.IsType<EventReadModel>(okResult.Value);
        Assert.Equal(eventId, returnedEvent.Id);
        _mediatorMock.Verify(m => m.Send(It.Is<GetEventById>(q => q.EventId == eventId), default), Times.Once);
    }
}