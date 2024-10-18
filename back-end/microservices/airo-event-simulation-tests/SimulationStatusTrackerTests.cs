using airo_event_simulation_engine.Impl;

namespace airo_event_simulation_tests;

public class SimulationStatusTrackerTests
{
    private readonly SimulationStatusTracker _statusTracker;

    public SimulationStatusTrackerTests()
    {
        _statusTracker = new SimulationStatusTracker();
    }

    [Fact]
    public void AddLog_ShouldAddLogToExistingEvent()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var initialLog = "Initial log entry";

        // Act
        _statusTracker.AddLog(eventId, initialLog);
        _statusTracker.AddLog(eventId, "Second log entry");

        var result = _statusTracker.GetSimulationStatus(eventId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Logs.Count);
        Assert.Contains(initialLog, result.Logs);
        Assert.Contains("Second log entry", result.Logs);
    }

    [Fact]
    public void AddLog_ShouldCreateNewSimulationStatusIfNoneExists()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var logEntry = "New log entry for a new event";

        // Act
        _statusTracker.AddLog(eventId, logEntry);

        var result = _statusTracker.GetSimulationStatus(eventId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(eventId, result.EventId);
        Assert.Single(result.Logs);
        Assert.Contains(logEntry, result.Logs);
    }

    [Fact]
    public void GetSimulationStatus_ShouldReturnNullIfEventIdNotFound()
    {
        // Arrange
        var nonExistentEventId = Guid.NewGuid();

        // Act
        var result = _statusTracker.GetSimulationStatus(nonExistentEventId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void AddLog_ShouldHandleConcurrentAddsCorrectly()
    {
        // Arrange
        var eventId = Guid.NewGuid();

        // Act
        Parallel.For(0, 100, i => _statusTracker.AddLog(eventId, $"Log {i}"));

        var result = _statusTracker.GetSimulationStatus(eventId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(100, result.Logs.Count);
        for (int i = 0; i < 100; i++)
        {
            Assert.Contains($"Log {i}", result.Logs);
        }
    }
}