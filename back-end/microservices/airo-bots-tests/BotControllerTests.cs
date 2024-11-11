using airo_bots_microservice.Controllers;
using airo_bots_microservice.Domain.Read;
using airo_bots_microservice.Domain.Read.Queries;
using airo_bots_microservice.Domain.Write.Commands;
using airo_bots_microservice.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace airo_bots_tests;

public class BotControllerTests
{
    private readonly BotController _controller;
    private readonly Mock<IMediator> _mediatorMock;

    public BotControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _controller = new BotController(_mediatorMock.Object);
    }

    [Fact]
    public async Task CreateBot_ShouldReturnOkWithBotId()
    {
        // Arrange
        var request = new CreateBotRequest(Name: "TestBot", Price: 100, Health: 100, Attack: 10, Defense: 20);
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<CreateBotCommand>(), default))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.CreateBot(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var botId = Assert.IsType<Guid>(okResult.Value);

        _mediatorMock.Verify(m => m.Send(It.IsAny<CreateBotCommand>(), default), Times.Once);
        Assert.NotEqual(Guid.Empty, botId);
    }

    [Fact]
    public async Task UpdateBot_ShouldReturnOk()
    {
        // Arrange
        var request = new UpdateBotRequest(Id: Guid.NewGuid(), Name: "UpdatedBot", Price: 150, Health: 100, Attack: 10, Defense: 20);
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<UpdateBotCommand>(), default))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.UpdateBot(request);

        // Assert
        Assert.IsType<OkResult>(result);
        _mediatorMock.Verify(m => m.Send(It.IsAny<UpdateBotCommand>(), default), Times.Once);
    }

    [Fact]
    public async Task DeleteBot_ShouldReturnOk()
    {
        // Arrange
        var botId = Guid.NewGuid();
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<DeleteBotCommand>(), default))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.DeleteBot(botId);

        // Assert
        Assert.IsType<OkResult>(result);
        _mediatorMock.Verify(m => m.Send(It.IsAny<DeleteBotCommand>(), default), Times.Once);
    }

    [Fact]
    public async Task GetBots_ShouldReturnOkWithAllBots_WhenNoIdsProvided()
    {
        // Arrange
        var bots = new[] { new BotReadModel { Id = Guid.NewGuid(), Name = "Bot1", Price = 100.0m } };
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<GetAllBots>(), default))
            .ReturnsAsync(bots);

        // Act
        var result = await _controller.GetBots(null);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedBots = Assert.IsType<BotReadModel[]>(okResult.Value);

        Assert.Single(returnedBots);
        Assert.Equal(bots[0].Id, returnedBots[0].Id);
        _mediatorMock.Verify(m => m.Send(It.IsAny<GetAllBots>(), default), Times.Once);
    }

    [Fact]
    public async Task GetBots_ShouldReturnOkWithBotsByIds_WhenIdsProvided()
    {
        // Arrange
        var botIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var bots = new[]
        {
                new BotReadModel { Id = botIds[0], Name = "Bot1", Price = 100.0m },
                new BotReadModel { Id = botIds[1], Name = "Bot2", Price = 150.0m }
            };
        _mediatorMock
            .Setup(m => m.Send(It.IsAny<GetBotsByIds>(), default))
            .ReturnsAsync(bots);

        // Act
        var result = await _controller.GetBots(botIds);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedBots = Assert.IsType<BotReadModel[]>(okResult.Value);

        Assert.Equal(2, returnedBots.Length);
        Assert.Equal(botIds[0], returnedBots[0].Id);
        Assert.Equal(botIds[1], returnedBots[1].Id);
        _mediatorMock.Verify(m => m.Send(It.IsAny<GetBotsByIds>(), default), Times.Once);
    }
}
