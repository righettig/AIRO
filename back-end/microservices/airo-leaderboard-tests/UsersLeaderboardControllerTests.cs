using airo_leaderboard_microservice.Common.Services.Interfaces;
using airo_leaderboard_microservice.Users;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace airo_leaderboard_tests;

public class UsersLeaderboardControllerTests
{
    private readonly Mock<ILeaderboardReadService<UserLeaderboardEntry>> _leaderboardServiceMock;
    private readonly UsersLeaderboardController _controller;

    public UsersLeaderboardControllerTests()
    {
        _leaderboardServiceMock = new Mock<ILeaderboardReadService<UserLeaderboardEntry>>();
        _controller = new UsersLeaderboardController(_leaderboardServiceMock.Object);
    }

    [Fact]
    public async Task GetTopUsers_ReturnsOk_WithTopNUsers()
    {
        // Arrange
        int n = 5;
        var topUsers = new List<UserLeaderboardEntry>
        {
            new() { Id = Guid.NewGuid().ToString(), Wins = 2, Losses = 1, TotalEvents = 3 },
            new() { Id = Guid.NewGuid().ToString(), Wins = 1, Losses = 3, TotalEvents = 4 }
        };

        _leaderboardServiceMock.Setup(service => service.GetTopNAsync(n)).ReturnsAsync(topUsers);

        // Act
        var result = await _controller.GetTopUsers(n);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(topUsers, okResult.Value);
        _leaderboardServiceMock.Verify(service => service.GetTopNAsync(n), Times.Once);
    }

    [Fact]
    public async Task GetUserById_ReturnsOk_WithUserEntry()
    {
        // Arrange
        var userId = "user1";
        var userEntry = new UserLeaderboardEntry { Id = Guid.NewGuid().ToString(), Wins = 2, Losses = 1, TotalEvents = 3 };

        _leaderboardServiceMock.Setup(service => service.GetByIdAsync(userId)).ReturnsAsync(userEntry);

        // Act
        var result = await _controller.GetUserById(userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(userEntry, okResult.Value);
        _leaderboardServiceMock.Verify(service => service.GetByIdAsync(userId), Times.Once);
    }

    [Fact]
    public async Task GetUserById_ReturnsOk_WithNull_WhenUserNotFound()
    {
        // Arrange
        var userId = "user1";

        _leaderboardServiceMock.Setup(service => service.GetByIdAsync(userId)).ReturnsAsync((UserLeaderboardEntry)null);

        // Act
        var result = await _controller.GetUserById(userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Null(okResult.Value);
        _leaderboardServiceMock.Verify(service => service.GetByIdAsync(userId), Times.Once);
    }
}