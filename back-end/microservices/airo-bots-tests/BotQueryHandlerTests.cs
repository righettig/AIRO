using airo_bots_microservice.Domain.Read;
using airo_bots_microservice.Domain.Read.Queries;
using airo_bots_microservice.Domain.Read.Queries.Handlers;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using Moq;

namespace airo_bots_tests;

public class BotQueryHandlerTests
{
    private readonly BotQueryHandler _handler;
    private readonly Mock<IReadRepository<BotReadModel>> _readRepositoryMock;

    public BotQueryHandlerTests()
    {
        _readRepositoryMock = new Mock<IReadRepository<BotReadModel>>();
        _handler = new BotQueryHandler(_readRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_GetAllBots_ShouldReturnAllBots()
    {
        // Arrange
        var bots = new[]
        {
                new BotReadModel { Id = Guid.NewGuid(), Name = "Bot1", Price = 100.0m },
                new BotReadModel { Id = Guid.NewGuid(), Name = "Bot2", Price = 150.0m }
            };

        _readRepositoryMock.Setup(repo => repo.Entities).Returns(bots.AsQueryable());

        // Act
        var result = await _handler.Handle(new GetAllBots(), CancellationToken.None);

        // Assert
        Assert.Equal(2, result.Length);
        Assert.Equal(bots[0].Id, result[0].Id);
        Assert.Equal(bots[1].Id, result[1].Id);
    }

    [Fact]
    public async Task Handle_GetBotsByIds_ShouldReturnCorrectBots_WhenBotIdsAreValid()
    {
        // Arrange
        var botIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var bots = new[]
        {
                new BotReadModel { Id = botIds[0], Name = "Bot1", Price = 100.0m },
                new BotReadModel { Id = botIds[1], Name = "Bot2", Price = 150.0m }
            };

        _readRepositoryMock.Setup(repo => repo.Entities).Returns(bots.AsQueryable());

        // Act
        var result = await _handler.Handle(new GetBotsByIds(botIds), CancellationToken.None);

        // Assert
        Assert.Equal(2, result.Length);
        Assert.Equal(botIds[0], result[0].Id);
        Assert.Equal(botIds[1], result[1].Id);
    }

    [Fact]
    public async Task Handle_GetBotsByIds_ShouldReturnEmptyArray_WhenNoMatchingBotsFound()
    {
        // Arrange
        var botIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var bots = new[]
        {
                new BotReadModel { Id = Guid.NewGuid(), Name = "Bot1", Price = 100.0m }
            };

        _readRepositoryMock.Setup(repo => repo.Entities).Returns(bots.AsQueryable());

        // Act
        var result = await _handler.Handle(new GetBotsByIds(botIds), CancellationToken.None);

        // Assert
        Assert.Empty(result);
    }
}