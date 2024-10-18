using airo_leaderboard_microservice.Behaviours;
using airo_leaderboard_microservice.Common.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace airo_leaderboard_tests;

public class BehaviorsLeaderboardControllerTests
{
    private readonly Mock<ILeaderboardReadService<BehaviourLeaderboardEntry>> _leaderboardServiceMock;
    private readonly BehaviorsLeaderboardController _controller;

    public BehaviorsLeaderboardControllerTests()
    {
        _leaderboardServiceMock = new Mock<ILeaderboardReadService<BehaviourLeaderboardEntry>>();
        _controller = new BehaviorsLeaderboardController(_leaderboardServiceMock.Object);
    }

    [Fact]
    public async Task GetTopBehaviors_ReturnsOk_WithTopNBehaviors()
    {
        // Arrange
        int n = 5;
        var topBehaviors = new List<BehaviourLeaderboardEntry>
        {
            new() { Id = Guid.NewGuid().ToString(), Wins = 2, Losses = 1, TotalEvents = 3 },
            new() { Id = Guid.NewGuid().ToString(), Wins = 1, Losses = 3, TotalEvents = 4 }
        };

        _leaderboardServiceMock.Setup(service => service.GetTopNAsync(n)).ReturnsAsync(topBehaviors);

        // Act
        var result = await _controller.GetTopBehaviors(n);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(topBehaviors, okResult.Value);
        _leaderboardServiceMock.Verify(service => service.GetTopNAsync(n), Times.Once);
    }

    [Fact]
    public async Task GetBehaviorById_ReturnsOk_WithBehaviorEntry()
    {
        // Arrange
        var behaviorId = Guid.NewGuid();
        var behaviorEntry = new BehaviourLeaderboardEntry { Id = Guid.NewGuid().ToString(), Wins = 2, Losses = 1, TotalEvents = 3 };

        _leaderboardServiceMock.Setup(service => service.GetByIdAsync(behaviorId.ToString())).ReturnsAsync(behaviorEntry);

        // Act
        var result = await _controller.GetBehaviorById(behaviorId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(behaviorEntry, okResult.Value);
        _leaderboardServiceMock.Verify(service => service.GetByIdAsync(behaviorId.ToString()), Times.Once);
    }

    [Fact]
    public async Task GetBehaviorById_ReturnsOk_WithNull_WhenBehaviorNotFound()
    {
        // Arrange
        var behaviorId = Guid.NewGuid();

        _leaderboardServiceMock.Setup(service => service.GetByIdAsync(behaviorId.ToString())).ReturnsAsync((BehaviourLeaderboardEntry)null);

        // Act
        var result = await _controller.GetBehaviorById(behaviorId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Null(okResult.Value);
        _leaderboardServiceMock.Verify(service => service.GetByIdAsync(behaviorId.ToString()), Times.Once);
    }
}