using airo_purchase_microservice.Controllers;
using airo_purchase_microservice.Domain.Read.Queries;
using airo_purchase_microservice.Domain.Write.Commands;
using airo_purchase_microservice.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace airo_purchase_tests;

class TestPurchaseController(IMediator mediator) : PurchaseController(mediator) 
{
    protected override Guid GetUserGuid(string userId) => Guid.Parse(userId);
}

public class PurchaseControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly TestPurchaseController _controller;

    private const string USER_ID = "8176b2e3-97cd-41f2-a71e-a31a606c5087";
    private readonly Guid UserId = Guid.Parse(USER_ID);

    public PurchaseControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _controller = new TestPurchaseController(_mediatorMock.Object);
    }

    [Fact]
    public async Task PurchaseBot_ShouldSendPurchaseBotCommand()
    {
        // Arrange
        var request = new PurchaseBotRequest(UserId: USER_ID, BotId: Guid.NewGuid());

        _mediatorMock
            .Setup(m => m.Send(It.IsAny<PurchaseBotCommand>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.PurchaseBot(request);

        // Assert
        _mediatorMock.Verify(m => m.Send(It.Is<PurchaseBotCommand>(c =>
            c.UserId == UserId && c.BotId == request.BotId), It.IsAny<CancellationToken>()), Times.Once);

        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task GetPurchasedBotsByUserId_ShouldReturnBotsForUser()
    {
        // Arrange
        var userId = USER_ID;
        var userIdGuid = UserId;
        var expectedBots = new[] { Guid.NewGuid(), Guid.NewGuid() }; // example purchased bot IDs

        _mediatorMock
            .Setup(m => m.Send(It.IsAny<GetPurchasedBotsByUserId>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedBots);

        // Act
        var result = await _controller.GetPurchasedBotsByUserId(userId);

        // Assert
        _mediatorMock.Verify(m => m.Send(It.Is<GetPurchasedBotsByUserId>(q => q.UserId == userIdGuid), It.IsAny<CancellationToken>()), Times.Once);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedBots, okResult.Value);
    }
}
