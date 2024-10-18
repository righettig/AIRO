using airo_leaderboard_microservice.Behaviours;
using airo_leaderboard_microservice.Common.Models;
using airo_leaderboard_microservice.Common.Services.Impl;
using airo_leaderboard_microservice.Common.Services.Interfaces;
using airo_leaderboard_microservice.Users;
using Moq;

namespace airo_leaderboard_tests;

public class EventCompletedProcessorTests
{
    private readonly Mock<ILeaderboardWriteService<UserLeaderboardEntry>> _userLeaderboardServiceMock;
    private readonly Mock<ILeaderboardWriteService<BehaviourLeaderboardEntry>> _behavioursLeaderboardServiceMock;
    private readonly Mock<IEventSubscriptionService> _eventSubscriptionServiceMock;

    private readonly EventCompletedProcessor _processor;

    public EventCompletedProcessorTests()
    {
        _userLeaderboardServiceMock = new Mock<ILeaderboardWriteService<UserLeaderboardEntry>>();
        _behavioursLeaderboardServiceMock = new Mock<ILeaderboardWriteService<BehaviourLeaderboardEntry>>();
        _eventSubscriptionServiceMock = new Mock<IEventSubscriptionService>();

        _processor = new EventCompletedProcessor(
            _userLeaderboardServiceMock.Object,
            _behavioursLeaderboardServiceMock.Object,
            _eventSubscriptionServiceMock.Object
        );
    }

    [Fact]
    public async Task ProcessEventAsync_ShouldMarkWinnerAndLosersCorrectly()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var winnerId = "winnerUser";
        var eventMessage = new EventCompletedMessage
        {
            EventId = eventId,
            WinnerUserId = winnerId
        };

        var participants = new[]
        {
            new EventSubscriptionDto { UserId = "winnerUser", BotBehaviourId = Guid.NewGuid() },
            new EventSubscriptionDto { UserId = "loserUser", BotBehaviourId = Guid.NewGuid() }
        };

        _eventSubscriptionServiceMock
            .Setup(s => s.GetParticipants(eventId))
            .ReturnsAsync(participants);

        // Act
        await _processor.ProcessEventAsync(eventMessage);

        // Assert
        _userLeaderboardServiceMock.Verify(s => s.MarkAsWinner("winnerUser"), Times.Once);
        _behavioursLeaderboardServiceMock.Verify(s => s.MarkAsWinner(participants[0].BotBehaviourId.ToString()), Times.Once);

        _userLeaderboardServiceMock.Verify(s => s.MarkAsLoser("loserUser"), Times.Once);
        _behavioursLeaderboardServiceMock.Verify(s => s.MarkAsLoser(participants[1].BotBehaviourId.ToString()), Times.Once);
    }

    [Fact]
    public async Task ProcessEventAsync_ShouldCatchExceptionDuringProcessing()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var winnerId = "winnerUser";
        var eventMessage = new EventCompletedMessage
        {
            EventId = eventId,
            WinnerUserId = winnerId
        };

        var participants = new[]
        {
            new EventSubscriptionDto { UserId = "winnerUser", BotBehaviourId = Guid.NewGuid() },
            new EventSubscriptionDto { UserId = "loserUser", BotBehaviourId = Guid.NewGuid() }
        };

        _eventSubscriptionServiceMock
            .Setup(s => s.GetParticipants(eventId))
            .ReturnsAsync(participants);

        _userLeaderboardServiceMock
            .Setup(s => s.MarkAsWinner("winnerUser"))
            .ThrowsAsync(new Exception("Test exception"));

        // Act
        await _processor.ProcessEventAsync(eventMessage);

        // Assert
        _userLeaderboardServiceMock.Verify(s => s.MarkAsWinner("winnerUser"), Times.Once);
        _behavioursLeaderboardServiceMock.Verify(s => s.MarkAsWinner(participants[0].BotBehaviourId.ToString()), Times.Never);

        // Ensure the exception was caught and processing continued
        _userLeaderboardServiceMock.Verify(s => s.MarkAsLoser("loserUser"), Times.Once);
        _behavioursLeaderboardServiceMock.Verify(s => s.MarkAsLoser(participants[1].BotBehaviourId.ToString()), Times.Once);
    }
}