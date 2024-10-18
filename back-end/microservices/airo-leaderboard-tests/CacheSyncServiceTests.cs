using airo_leaderboard_microservice.Common.Data.Interfaces;
using airo_leaderboard_microservice.Common.Services.Impl;
using Microsoft.Azure.Cosmos;
using Moq;

namespace airo_leaderboard_tests;

public class CacheSyncServiceTests
{
    private readonly Mock<Container> _cosmosDbContainerMock;
    private readonly Mock<IRedisCache<ILeaderboardEntry>> _redisCacheMock;

    private readonly CacheSyncService<ILeaderboardEntry> _cacheSyncService;

    public CacheSyncServiceTests()
    {
        _cosmosDbContainerMock = new Mock<Container>();
        _redisCacheMock = new Mock<IRedisCache<ILeaderboardEntry>>();
        _cacheSyncService = new CacheSyncService<ILeaderboardEntry>(_cosmosDbContainerMock.Object, _redisCacheMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldSyncEntriesFromCosmosDbToRedis()
    {
        // Arrange
        var leaderboardEntries = new List<ILeaderboardEntry>
    {
        new LeaderboardEntry { Id = "entry1", Wins = 5, Losses = 3, TotalEvents = 8 },
        new LeaderboardEntry { Id = "entry2", Wins = 2, Losses = 4, TotalEvents = 6 }
    };

        var queryMock = new Mock<FeedIterator<ILeaderboardEntry>>();
        queryMock.SetupSequence(q => q.HasMoreResults)
            .Returns(true)
            .Returns(false);
        queryMock.Setup(q => q.ReadNextAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(MockFeedResponse(leaderboardEntries));

        _cosmosDbContainerMock
            .Setup(c => c.GetItemQueryIterator<ILeaderboardEntry>(It.IsAny<string>(), null, null))
            .Returns(queryMock.Object);

        var stoppingToken = new CancellationTokenSource().Token;

        // Act
        await _cacheSyncService.StartAsync(stoppingToken);

        // Assert
        _redisCacheMock.Verify(r => r.SetEntryAsync(It.IsAny<ILeaderboardEntry>()), Times.Exactly(leaderboardEntries.Count));
        _redisCacheMock.Verify(r => r.SetEntryAsync(leaderboardEntries[0]), Times.Once);
        _redisCacheMock.Verify(r => r.SetEntryAsync(leaderboardEntries[1]), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldHandleNoEntriesFromCosmosDb()
    {
        // Arrange
        var queryMock = new Mock<FeedIterator<ILeaderboardEntry>>();
        queryMock.SetupSequence(q => q.HasMoreResults)
            .Returns(true)
            .Returns(false);
        queryMock.Setup(q => q.ReadNextAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(MockFeedResponse(new List<ILeaderboardEntry>()));

        _cosmosDbContainerMock
            .Setup(c => c.GetItemQueryIterator<ILeaderboardEntry>(It.IsAny<string>(), null, null))
            .Returns(queryMock.Object);

        var stoppingToken = new CancellationTokenSource().Token;

        // Act
        await _cacheSyncService.StartAsync(stoppingToken);

        // Assert
        _redisCacheMock.Verify(r => r.SetEntryAsync(It.IsAny<ILeaderboardEntry>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldContinueOnCosmosDbError()
    {
        // Arrange
        var queryMock = new Mock<FeedIterator<ILeaderboardEntry>>();
        queryMock.SetupSequence(q => q.HasMoreResults)
            .Returns(true);
        queryMock.Setup(q => q.ReadNextAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new CosmosException("Test error", System.Net.HttpStatusCode.InternalServerError, 0, "", 0));

        _cosmosDbContainerMock
            .Setup(c => c.GetItemQueryIterator<ILeaderboardEntry>(It.IsAny<string>(), null, null))
            .Returns(queryMock.Object);

        var stoppingToken = new CancellationTokenSource().Token;

        // Act
        await _cacheSyncService.StartAsync(stoppingToken);

        // Assert
        _redisCacheMock.Verify(r => r.SetEntryAsync(It.IsAny<ILeaderboardEntry>()), Times.Never);
        // Ensure that despite the error, the service doesn't crash
    }

    private static FeedResponse<T> MockFeedResponse<T>(List<T> items) where T : class
    {
        var feedResponseMock = new Mock<FeedResponse<T>>();
        feedResponseMock.Setup(r => r.GetEnumerator()).Returns(items.GetEnumerator());
        return feedResponseMock.Object;
    }
}