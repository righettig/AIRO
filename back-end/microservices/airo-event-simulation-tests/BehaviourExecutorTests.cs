using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Impl;
using Moq;

namespace airo_event_simulation_tests;

public class BehaviourExecutorTests
{
    private readonly Mock<IBotAgent> _botAgentMock;
    private readonly Mock<IBotState> _botStateMock;
    private readonly Mock<ISimulationAction> _simulationActionMock;

    private readonly BehaviourExecutor _behaviourExecutor;

    public BehaviourExecutorTests()
    {
        _behaviourExecutor = new BehaviourExecutor();
        _botAgentMock = new Mock<IBotAgent>();
        _botStateMock = new Mock<IBotState>();
        _simulationActionMock = new Mock<ISimulationAction>();
    }

    [Fact]
    public async Task Execute_ShouldReturnSimulationAction_WhenExecutionCompletesWithinTimeout()
    {
        // Arrange
        _botAgentMock.Setup(b => b.ComputeNextMove(_botStateMock.Object)).Returns(_simulationActionMock.Object);
        var cancellationToken = new CancellationToken();

        // Act
        var result = await _behaviourExecutor.Execute(_botAgentMock.Object, _botStateMock.Object, cancellationToken);

        // Assert
        Assert.Equal(_simulationActionMock.Object, result);
        _botAgentMock.Verify(b => b.ComputeNextMove(_botStateMock.Object), Times.Once);
    }

    [Fact]
    public async Task Execute_ShouldThrowTimeoutException_WhenExecutionExceedsTimeout()
    {
        // Arrange
        _botAgentMock.Setup(b => b.ComputeNextMove(_botStateMock.Object)).Returns(() =>
        {
            // Simulate a long-running task by delaying more than the timeout duration
            Task.Delay(TimeSpan.FromSeconds(10)).Wait();
            return _simulationActionMock.Object;
        });
        var cancellationToken = new CancellationToken();

        // Act & Assert
        await Assert.ThrowsAsync<TimeoutException>(() => _behaviourExecutor.Execute(_botAgentMock.Object, _botStateMock.Object, cancellationToken));
    }

    [Fact]
    public async Task Execute_ShouldThrowOperationCanceledException_WhenCancellationTokenIsCanceled()
    {
        // Arrange
        var cancellationTokenSource = new CancellationTokenSource();
        cancellationTokenSource.Cancel();  // Cancel the token immediately

        // Act & Assert
        await Assert.ThrowsAsync<OperationCanceledException>(() => _behaviourExecutor.Execute(_botAgentMock.Object, _botStateMock.Object, cancellationTokenSource.Token));
    }
}
