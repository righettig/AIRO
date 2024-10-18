using airo_leaderboard_microservice.Common.Data.Interfaces;
using airo_leaderboard_microservice.Common.Services.Impl;
using Moq;

namespace airo_leaderboard_tests;

public class LeaderboardWriteServiceTests
{
    private readonly Mock<IRedisCache<LeaderboardEntry>> _redisCacheMock;
    private readonly Mock<ICosmosDbContext<LeaderboardEntry>> _cosmosDbContextMock;

    private readonly LeaderboardWriteService<LeaderboardEntry> _service;

    public LeaderboardWriteServiceTests()
    {
        _redisCacheMock = new Mock<IRedisCache<LeaderboardEntry>>();
        _cosmosDbContextMock = new Mock<ICosmosDbContext<LeaderboardEntry>>();
        _service = new LeaderboardWriteService<LeaderboardEntry>(_redisCacheMock.Object, _cosmosDbContextMock.Object);
    }

    [Fact]
    public async Task MarkAsLoser_ShouldUpdateRedisAndCosmos_WithNewEntry_WhenNoEntryExists()
    {
        // Arrange
        var id = "user1";
        var newEntry = new Mock<LeaderboardEntry>();
        _redisCacheMock.Setup(r => r.GetEntryAsync(id)).ReturnsAsync((LeaderboardEntry)null);

        _redisCacheMock.Setup(r => r.SetEntryAsync(It.IsAny<LeaderboardEntry>())).Returns(Task.CompletedTask);
        _cosmosDbContextMock.Setup(c => c.CreateOrUpdateEntryAsync(It.IsAny<LeaderboardEntry>())).Returns(Task.CompletedTask);

        // Act
        await _service.MarkAsLoser(id);

        // Assert
        _redisCacheMock.Verify(r => r.GetEntryAsync(id), Times.Once);
        _redisCacheMock.Verify(r => r.SetEntryAsync(It.IsAny<LeaderboardEntry>()), Times.Once);
        _cosmosDbContextMock.Verify(c => c.CreateOrUpdateEntryAsync(It.IsAny<LeaderboardEntry>()), Times.Once);
    }

    [Fact]
    public async Task MarkAsWinner_ShouldUpdateRedisAndCosmos_WithNewEntry_WhenNoEntryExists()
    {
        // Arrange
        var id = "user1";
        var newEntry = new Mock<LeaderboardEntry>();
        _redisCacheMock.Setup(r => r.GetEntryAsync(id)).ReturnsAsync((LeaderboardEntry)null);

        _redisCacheMock.Setup(r => r.SetEntryAsync(It.IsAny<LeaderboardEntry>())).Returns(Task.CompletedTask);
        _cosmosDbContextMock.Setup(c => c.CreateOrUpdateEntryAsync(It.IsAny<LeaderboardEntry>())).Returns(Task.CompletedTask);

        // Act
        await _service.MarkAsWinner(id);

        // Assert
        _redisCacheMock.Verify(r => r.GetEntryAsync(id), Times.Once);
        _redisCacheMock.Verify(r => r.SetEntryAsync(It.IsAny<LeaderboardEntry>()), Times.Once);
        _cosmosDbContextMock.Verify(c => c.CreateOrUpdateEntryAsync(It.IsAny<LeaderboardEntry>()), Times.Once);
    }

    [Fact]
    public async Task MarkAsLoser_ShouldUpdateRedisAndCosmos_WithExistingEntry()
    {
        // Arrange
        var id = "user2";
        var existingEntry = new LeaderboardEntry { Id = id, Wins = 5, Losses = 0, TotalEvents = 10 };

        _redisCacheMock.Setup(r => r.GetEntryAsync(id)).ReturnsAsync(existingEntry);

        _redisCacheMock.Setup(r => r.SetEntryAsync(It.IsAny<LeaderboardEntry>())).Returns(Task.CompletedTask);
        _cosmosDbContextMock.Setup(c => c.CreateOrUpdateEntryAsync(It.IsAny<LeaderboardEntry>())).Returns(Task.CompletedTask);

        // Act
        await _service.MarkAsLoser(id);

        // Assert
        _redisCacheMock.Verify(r => r.GetEntryAsync(id), Times.Once);
        _redisCacheMock.Verify(r => r.SetEntryAsync(It.Is<LeaderboardEntry>(e => e.Wins == 5 && e.Losses == 1 && e.TotalEvents == 11)), Times.Once);
        _cosmosDbContextMock.Verify(c => c.CreateOrUpdateEntryAsync(It.Is<LeaderboardEntry>(e => e.Wins == 5 && e.Losses == 1 && e.TotalEvents == 11)), Times.Once);
    }

    [Fact]
    public async Task MarkAsWinner_ShouldUpdateRedisAndCosmos_WithExistingEntry()
    {
        // Arrange
        var id = "user2";
        var existingEntry = new LeaderboardEntry { Id = id, Wins = 5, Losses = 0, TotalEvents = 10 };

        _redisCacheMock.Setup(r => r.GetEntryAsync(id)).ReturnsAsync(existingEntry);

        _redisCacheMock.Setup(r => r.SetEntryAsync(It.IsAny<LeaderboardEntry>())).Returns(Task.CompletedTask);
        _cosmosDbContextMock.Setup(c => c.CreateOrUpdateEntryAsync(It.IsAny<LeaderboardEntry>())).Returns(Task.CompletedTask);

        // Act
        await _service.MarkAsWinner(id);

        // Assert
        _redisCacheMock.Verify(r => r.GetEntryAsync(id), Times.Once);
        _redisCacheMock.Verify(r => r.SetEntryAsync(It.Is<LeaderboardEntry>(e => e.Wins == 6 && e.Losses == 0 && e.TotalEvents == 11)), Times.Once);
        _cosmosDbContextMock.Verify(c => c.CreateOrUpdateEntryAsync(It.Is<LeaderboardEntry>(e => e.Wins == 6 && e.Losses == 0 && e.TotalEvents == 11)), Times.Once);
    }
}