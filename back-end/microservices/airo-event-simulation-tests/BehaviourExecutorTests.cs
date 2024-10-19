using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Impl;

namespace airo_event_simulation_tests;

public class BehaviourExecutorTests
{
    private readonly BehaviourExecutor _behaviourExecutor;

    public BehaviourExecutorTests()
    {
        _behaviourExecutor = new BehaviourExecutor();
    }

    [Fact]
    public async Task Execute_ShouldThrowTimeoutException_WhenScriptTakesTooLong()
    {
        // Arrange
        var script = "await System.Threading.Tasks.Task.Delay(10000);"; // This simulates a long-running script.
        var state = new BotState(Guid.NewGuid(), 100, new Position(0, 0), []);

        // Act & Assert
        await Assert.ThrowsAsync<TimeoutException>(async () =>
            await _behaviourExecutor.Execute(script, state, CancellationToken.None));
    }

    [Fact]
    public async Task Execute_ShouldThrowTaskCanceledException_WhenCanceledBeforeTimeout()
    {
        // Arrange
        var script = "await Task.Delay(100);"; // Simulates a script that waits for some time.
        var state = new BotState(Guid.NewGuid(), 100, new Position(0, 0), []);
        var cts = new CancellationTokenSource();

        // Cancel the task immediately
        cts.Cancel();

        // Act & Assert
        await Assert.ThrowsAsync<TaskCanceledException>(async () =>
            await _behaviourExecutor.Execute(script, state, cts.Token));
    }

    [Fact]
    public async Task Execute_ShouldCompleteWhenScriptIsFast()
    {
        // Arrange
        var script = "var x = 5 + 5;"; // A quick script execution.
        var state = new BotState(Guid.NewGuid(), 100, new Position(0, 0), []);
        var cancellationToken = CancellationToken.None;

        // Act
        var exception = await Record.ExceptionAsync(
            async () => await _behaviourExecutor.Execute(script, state, cancellationToken));

        // Assert
        // Ensure the execution was successful and completed without exceptions
        Assert.Null(exception);
    }
}