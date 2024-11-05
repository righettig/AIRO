using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Impl;
using airo_event_simulation_engine.Interfaces;
using Moq;

namespace airo_event_simulation_tests;

public class BehaviourExecutorTests
{
    private readonly BehaviourExecutor _behaviourExecutor;

    public BehaviourExecutorTests()
    {
        _compilerMock = new Mock<IBehaviourCompiler>();
        _behaviourExecutor = new BehaviourExecutor(_compilerMock.Object);
    }

    [Fact]
    public async Task Execute_ShouldCompileAndReturnActionForNewBot()
    {
        // Arrange
        var mockBotAgent = new Mock<IBotAgent>();
        _compilerMock.Setup(c => c.Compile(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(mockBotAgent.Object);
        
        mockBotAgent.Setup(b => b.ComputeNextMove(It.IsAny<IBotState>())).Returns(new Mock<ISimulationAction>().Object);

        var state = new Mock<IBotState>();
        state.Setup(s => s.Id).Returns(Guid.NewGuid());

        var executor = new BehaviourExecutor(_compilerMock.Object);

        // Act
        var action = await executor.Execute("dummy_script", state.Object, CancellationToken.None);

        // Assert
        Assert.NotNull(action);
        _compilerMock.Verify(c => c.Compile(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Execute_ShouldThrowTimeoutExceptionForLongRunningScript()
    {
        // Arrange
        var mockBotAgent = new Mock<IBotAgent>();
        _compilerMock.Setup(c => c.Compile(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(mockBotAgent.Object);
        mockBotAgent.Setup(b => b.ComputeNextMove(It.IsAny<IBotState>())).Returns(() =>
        {
            Task.Delay(TimeSpan.FromSeconds(10)).Wait(); // Simulate long-running task
            return new Mock<ISimulationAction>().Object;
        });

        var state = new Mock<IBotState>();
        state.Setup(s => s.Id).Returns(Guid.NewGuid());

        var executor = new BehaviourExecutor();

        // Act & Assert
        await Assert.ThrowsAsync<TimeoutException>(() => executor.Execute("dummy_script", state.Object, CancellationToken.None));
    }

    [Fact]
    public async Task Execute_ShouldReturnActionForCachedBot()
    {
        // Arrange
        var mockBotAgent = new Mock<IBotAgent>();
        _compilerMock.Setup(c => c.Compile(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(mockBotAgent.Object);
        mockBotAgent.Setup(b => b.ComputeNextMove(It.IsAny<IBotState>())).Returns(new Mock<ISimulationAction>().Object);
        var state = new Mock<IBotState>();
        state.Setup(s => s.Id).Returns(Guid.NewGuid());

        var executor = new BehaviourExecutor(_compilerMock.Object);
        await executor.Execute("dummy_script", state.Object, CancellationToken.None);

        // Act
        var action = await executor.Execute("dummy_script", state.Object, CancellationToken.None);

        // Assert
        Assert.NotNull(action);
        _compilerMock.Verify(c => c.Compile(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Once); // only compiled once!
    }

    [Fact]
    public async Task Execute_ShouldThrowTaskCanceledOrOperationCanceledException_WhenCanceledBeforeTimeout()
    {
        // Arrange
        var mockBotAgent = new Mock<IBotAgent>();
        _compilerMock.Setup(c => c.Compile(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(mockBotAgent.Object);
        mockBotAgent.Setup(b => b.ComputeNextMove(It.IsAny<IBotState>())).Returns(() =>
        {
            Task.Delay(TimeSpan.FromSeconds(2)).Wait(); // Simulate long-running task
            return new Mock<ISimulationAction>().Object;
        });

        var state = new BotState(Guid.NewGuid(), 100, new Position(0, 0), []);
        var cts = new CancellationTokenSource();

        // Cancel the task immediately
        cts.Cancel();

        // Act & Assert
        var exception = await Assert.ThrowsAnyAsync<OperationCanceledException>(async () =>
            await _behaviourExecutor.Execute("dummy_script", state, cts.Token));

        // Assert it’s either TaskCanceledException or OperationCanceledException
        Assert.True(exception is TaskCanceledException or OperationCanceledException);
    }
}