using airo_event_subscriptions_domain.Domain.Read.Queries;
using airo_event_subscriptions_domain.Domain.Write.Commands;
using airo_event_subscriptions_microservice.Controllers;
using airo_event_subscriptions_microservice.DTOs;
using airo_event_subscriptions_microservice.Services.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace airo_event_subscriptions_tests;

public class EventSubscriptionsControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly Mock<IPurchaseService> _purchaseServiceMock;
    private readonly Mock<IRabbitMQPublisherService> _rabbitMQPublisherServiceMock;

    private readonly EventSubscriptionsController _controller;

    public EventSubscriptionsControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _purchaseServiceMock = new Mock<IPurchaseService>();
        _rabbitMQPublisherServiceMock = new Mock<IRabbitMQPublisherService>();
        _controller = new EventSubscriptionsController(_mediatorMock.Object, _purchaseServiceMock.Object, _rabbitMQPublisherServiceMock.Object);
    }

    [Fact]
    public async Task Subscribe_ShouldReturnOk_WhenUserOwnsBot()
    {
        // Arrange
        var request = new SubscribeToEventRequest(UserId: "user123", EventId: Guid.NewGuid(), BotId: Guid.NewGuid(), BotBehaviourId: Guid.NewGuid());

        _purchaseServiceMock.Setup(p => p.OwnsBot(request.UserId, request.BotId)).ReturnsAsync(true);

        // Act
        var result = await _controller.Subscribe(request);

        // Assert
        _mediatorMock.Verify(m => m.Send(It.IsAny<SubscribeToEventCommand>(), default), Times.Once);
        _rabbitMQPublisherServiceMock.Verify(r => r.OnEventSubscribed(request.UserId, request.EventId), Times.Once);
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task Subscribe_ShouldThrowInvalidOperationException_WhenUserDoesNotOwnBot()
    {
        // Arrange
        var request = new SubscribeToEventRequest(UserId: "user123", EventId: Guid.NewGuid(), BotId: Guid.NewGuid(), BotBehaviourId: Guid.NewGuid());

        _purchaseServiceMock.Setup(p => p.OwnsBot(request.UserId, request.BotId)).ReturnsAsync(false);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _controller.Subscribe(request));

        _mediatorMock.Verify(m => m.Send(It.IsAny<SubscribeToEventCommand>(), default), Times.Never);
        _rabbitMQPublisherServiceMock.Verify(r => r.OnEventSubscribed(It.IsAny<string>(), It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task Unsubscribe_ShouldReturnOk()
    {
        // Arrange
        var request = new UnsubscribeFromEventRequest(UserId: "user123", EventId: Guid.NewGuid());

        // Act
        var result = await _controller.Unsubscribe(request);

        // Assert
        _mediatorMock.Verify(m => m.Send(It.IsAny<UnsubscribeFromEventCommand>(), default), Times.Once);
        _rabbitMQPublisherServiceMock.Verify(r => r.OnEventUnsubscribed(request.UserId, request.EventId), Times.Once);
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task GetEventParticipants_ShouldReturnParticipants()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var participants = new[] { "user123", "user456" };

        _mediatorMock.Setup(m => m.Send(It.IsAny<GetEventParticipants>(), default)).ReturnsAsync(participants);

        // Act
        var result = await _controller.GetEventParticipants(eventId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(participants, okResult.Value);
    }

    [Fact]
    public async Task GetEventParticipantsFullDetails_ShouldReturnParticipantsFullDetails()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var participants = new[] 
        {
            new EventSubscriptionDto { UserId = "user123", BotId = Guid.NewGuid(), BotBehaviourId = Guid.NewGuid() },
            new EventSubscriptionDto { UserId = "user456", BotId = Guid.NewGuid(), BotBehaviourId = Guid.NewGuid() }
        };        

        _mediatorMock.Setup(m => m.Send(It.IsAny<GetEventParticipantsFullDetails>(), default)).ReturnsAsync(participants);

        // Act
        var result = await _controller.GetEventParticipantsFullDetails(eventId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(participants, okResult.Value);
    }

    [Fact]
    public async Task GetSubscribedEventsByUserId_ShouldReturnSubscribedEvents()
    {
        // Arrange
        var userId = "user123";
        var subscribedEvents = new[] { Guid.NewGuid(), Guid.NewGuid() };

        _mediatorMock.Setup(m => m.Send(It.IsAny<GetSubscribedEventsByUserId>(), default)).ReturnsAsync(subscribedEvents);

        // Act
        var result = await _controller.GetSubscribedEventsByUserId(userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(subscribedEvents, okResult.Value);
    }
}