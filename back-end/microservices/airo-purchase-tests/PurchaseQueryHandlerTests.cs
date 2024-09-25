using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_purchase_microservice.Domain.Read;
using airo_purchase_microservice.Domain.Read.Queries;
using airo_purchase_microservice.Domain.Read.Queries.Handlers;
using Moq;

namespace airo_purchase_tests;

public class PurchaseQueryHandlerTests
{
    private readonly Mock<IReadRepository<PurchaseReadModel>> _readRepositoryMock;
    private readonly PurchaseQueryHandler _handler;

    public PurchaseQueryHandlerTests()
    {
        _readRepositoryMock = new Mock<IReadRepository<PurchaseReadModel>>();
        _handler = new PurchaseQueryHandler(_readRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnBotIdsForUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var purchasedBots = new[]
        {
                new PurchaseReadModel { UserId = userId, BotId = Guid.NewGuid() },
                new PurchaseReadModel { UserId = userId, BotId = Guid.NewGuid() }
            };

        _readRepositoryMock
            .Setup(r => r.Entities)
            .Returns(purchasedBots.AsQueryable());

        var query = new GetPurchasedBotsByUserId(userId);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Equal(purchasedBots.Select(x => x.BotId).ToArray(), result);
    }

    [Fact]
    public async Task Handle_ShouldReturnEmptyArray_WhenUserHasNoPurchasedBots()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var purchasedBots = new PurchaseReadModel[0]; // Empty list

        _readRepositoryMock
            .Setup(r => r.Entities)
            .Returns(purchasedBots.AsQueryable());

        var query = new GetPurchasedBotsByUserId(userId);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task Handle_ShouldReturnOnlyBotsForGivenUserId()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var anotherUserId = Guid.NewGuid();

        var purchasedBots = new[]
        {
                new PurchaseReadModel { UserId = userId, BotId = Guid.NewGuid() },
                new PurchaseReadModel { UserId = anotherUserId, BotId = Guid.NewGuid() }, // Should not be included in result
                new PurchaseReadModel { UserId = userId, BotId = Guid.NewGuid() }
            };

        _readRepositoryMock
            .Setup(r => r.Entities)
            .Returns(purchasedBots.AsQueryable());

        var query = new GetPurchasedBotsByUserId(userId);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        var expectedBots = purchasedBots
            .Where(x => x.UserId == userId)
            .Select(x => x.BotId)
            .ToArray();

        Assert.Equal(expectedBots, result);
    }
}
