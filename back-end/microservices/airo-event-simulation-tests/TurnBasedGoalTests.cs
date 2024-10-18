using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Interfaces;
using Moq;

namespace airo_event_simulation_tests;

public class TurnBasedGoalTests
{
    [Fact]
    public void Constructor_ShouldInitializeWithMaxTurns()
    {
        // Arrange
        int maxTurns = 5;

        // Act
        var goal = new TurnBasedGoal(maxTurns);

        // Assert
        Assert.NotNull(goal);
    }

    [Fact]
    public void IsSimulationComplete_ShouldReturnFalse_WhenTurnCountIsLessThanMaxTurns()
    {
        // Arrange
        int maxTurns = 3;
        var goal = new TurnBasedGoal(maxTurns);
        var simulationMock = new Mock<ISimulation>();

        // Act & Assert
        for (int i = 0; i < maxTurns; i++)
        {
            bool result = goal.IsSimulationComplete(simulationMock.Object);
            Assert.False(result, $"Simulation should not be complete after {i + 1} turn(s).");
        }
    }

    [Fact]
    public void IsSimulationComplete_ShouldReturnTrue_WhenTurnCountExceedsMaxTurns()
    {
        // Arrange
        int maxTurns = 3;
        var goal = new TurnBasedGoal(maxTurns);
        var simulationMock = new Mock<ISimulation>();

        // Act
        for (int i = 0; i < maxTurns; i++)
        {
            bool result = goal.IsSimulationComplete(simulationMock.Object);
            Assert.False(result, $"Simulation should not be complete after {i + 1} turn(s).");
        }

        // On the next call, the simulation should be complete
        bool finalResult = goal.IsSimulationComplete(simulationMock.Object);

        // Assert
        Assert.True(finalResult, "Simulation should be complete after exceeding max turns.");
    }
}