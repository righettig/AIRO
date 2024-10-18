using airo_event_simulation_microservice;

namespace airo_event_simulation_tests;

public class SimulationTaskQueueTests
{
    private readonly SimulationTaskQueue _taskQueue;

    public SimulationTaskQueueTests()
    {
        _taskQueue = new SimulationTaskQueue();
    }

    [Fact]
    public void QueueBackgroundWorkItem_ShouldQueueWorkItem()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var taskExecuted = false;

        Func<CancellationToken, Task> workItem = async token =>
        {
            await Task.Delay(100, token);
            taskExecuted = true;
        };

        // Act
        _taskQueue.QueueBackgroundWorkItem(eventId, workItem);

        // Assert
        Assert.False(taskExecuted); // Task should not be executed immediately.
    }

    [Fact]
    public async Task DequeueAsync_ShouldExecuteQueuedWorkItem()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var taskExecuted = false;

        Func<CancellationToken, Task> workItem = async token =>
        {
            await Task.Delay(100, token);
            taskExecuted = true;
        };

        _taskQueue.QueueBackgroundWorkItem(eventId, workItem);

        // Act
        var dequeuedWorkItem = await _taskQueue.DequeueAsync(CancellationToken.None);
        await dequeuedWorkItem(CancellationToken.None);

        // Assert
        Assert.True(taskExecuted); // Task should be executed.
    }

    [Fact]
    public async Task TryCancelSimulation_ShouldCancelRunningSimulation()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var taskExecuted = false;

        _taskQueue.QueueBackgroundWorkItem(eventId, CreateWorkItem(() => taskExecuted = true));

        // Act
        await ExecuteWorkItem(eventId);

        _taskQueue.TryCancelSimulation(eventId);

        await Task.Delay(100); // allows TaskCanceledException to be thrown

        // Assert
        Assert.True(taskExecuted); // Task should be executed and marked as canceled.
    }

    [Fact]
    public async Task TryCancelSimulations_ShouldCancelAllRunningSimulations()
    {
        // Arrange
        var eventId1 = Guid.NewGuid();
        var taskExecuted1 = false;
        var eventId2 = Guid.NewGuid();
        var taskExecuted2 = false;

        _taskQueue.QueueBackgroundWorkItem(eventId1, CreateWorkItem(() => taskExecuted1 = true));
        _taskQueue.QueueBackgroundWorkItem(eventId2, CreateWorkItem(() => taskExecuted2 = true));

        // Act
        await ExecuteWorkItem(eventId1);
        await ExecuteWorkItem(eventId2);

        _taskQueue.TryCancelSimulations(); // assuming you have this method

        await Task.Delay(100); // allows TaskCanceledException to be thrown

        // Assert
        Assert.True(taskExecuted1); // Task should be executed and marked as canceled.
        Assert.True(taskExecuted2); // Task should be executed and marked as canceled.
    }

    // Helper method to create a work item that simulates a task and catches the cancellation
    private Func<CancellationToken, Task> CreateWorkItem(Action onTaskCanceledException)
    {
        return async token =>
        {
            try
            {
                await Task.Delay(1000, token); // Simulate long-running task
            }
            catch (TaskCanceledException)
            {
                onTaskCanceledException();
            }
        };
    }

    // Helper method to dequeue and execute a work item
    private async Task ExecuteWorkItem(Guid eventId)
    {
        var dequeuedWorkItem = await _taskQueue.DequeueAsync(CancellationToken.None);
        dequeuedWorkItem(CancellationToken.None);
    }

    [Fact]
    public void TryCancelSimulation_ShouldReturnFalse_WhenSimulationNotFound()
    {
        // Arrange
        var eventId = Guid.NewGuid();

        // Act
        var result = _taskQueue.TryCancelSimulation(eventId);

        // Assert
        Assert.False(result); // Should return false since no task was queued for this eventId.
    }
}
