using airo_common_lib.Time;
using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Interfaces;
using Moq;

namespace airo_event_simulation_tests;

public class TimeBasedGoalTests
{
    [Fact]
    public void Constructor_ShouldInitializeEndTime()
    {
        // Arrange
        var duration = TimeSpan.FromMinutes(5);
        var timeProviderMock = new Mock<ITimeProvider>();
        timeProviderMock.Setup(tp => tp.Now).Returns(DateTime.Now);

        // Act
        var goal = new TimeBasedGoal(duration, timeProviderMock.Object);

        // Assert
        Assert.NotNull(goal);
    }

    [Fact]
    public void IsSimulationComplete_ShouldReturnFalse_WhenTimeIsLessThanEndTime()
    {
        // Arrange
        var duration = TimeSpan.FromMinutes(5);
        var timeProviderMock = new Mock<ITimeProvider>();
        timeProviderMock.Setup(tp => tp.Now).Returns(DateTime.Now);

        var goal = new TimeBasedGoal(duration, timeProviderMock.Object);

        // Act
        bool result = goal.IsSimulationComplete(new Mock<ISimulation>().Object);

        // Assert
        Assert.False(result, "Simulation should not be complete before end time.");
    }

    [Fact]
    public void IsSimulationComplete_ShouldReturnTrue_WhenTimeIsEqualOrGreaterThanEndTime()
    {
        // Arrange
        var duration = TimeSpan.FromMinutes(5);
        var timeProviderMock = new Mock<ITimeProvider>();
        timeProviderMock.Setup(tp => tp.Now).Returns(DateTime.Now);
        
        var goal = new TimeBasedGoal(duration, timeProviderMock.Object);

        // Act
        timeProviderMock.Setup(tp => tp.Now).Returns(DateTime.Now.AddMinutes(10)); // Time has passed by

        bool result = goal.IsSimulationComplete(new Mock<ISimulation>().Object);

        // Assert
        Assert.True(result, "Simulation should be complete after the end time.");
    }
}