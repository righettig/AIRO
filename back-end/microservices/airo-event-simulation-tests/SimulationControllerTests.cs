using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;
using airo_event_simulation_infrastructure.Interfaces;
using airo_event_simulation_microservice.Controllers;
using airo_event_simulation_microservice.DTOs;
using airo_event_simulation_microservice.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace airo_event_simulation_tests;

public class SimulationControllerTests
{
    private readonly Mock<ISimulationStatusTracker> _mockStatusTracker;
    private readonly Mock<IBackgroundTaskQueue> _mockTaskQueue;
    private readonly Mock<ISimulationService> _mockSimulationService;
    private readonly Mock<ISimulationEngine> _mockEngine;
    private readonly Mock<ISimulationStateUpdater> _mockStateUpdater;
    private readonly Mock<IEventsService> _mockEventsService;

    private readonly SimulationController _controller;

    public SimulationControllerTests()
    {
        _mockStatusTracker = new Mock<ISimulationStatusTracker>();
        _mockTaskQueue = new Mock<IBackgroundTaskQueue>();
        _mockSimulationService = new Mock<ISimulationService>();
        _mockEngine = new Mock<ISimulationEngine>();
        _mockStateUpdater = new Mock<ISimulationStateUpdater>();
        _mockEventsService = new Mock<IEventsService>();

        _controller = new SimulationController(
            _mockStatusTracker.Object,
            _mockTaskQueue.Object,
            _mockSimulationService.Object,
            _mockEngine.Object,
            _mockStateUpdater.Object,
            _mockEventsService.Object
        );
    }

    [Fact]
    public void Simulate_ShouldReturnAcceptedResult_WhenSimulationIsQueued()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var simulation = new Mock<ISimulation>().Object;

        _mockSimulationService.Setup(s => s.LoadSimulation(eventId)).ReturnsAsync(simulation);

        _mockEngine.Setup(e => e.RunSimulationAsync(simulation, _mockStateUpdater.Object, default))
            .ReturnsAsync(new SimulationResult(Success: true, WinnerUserId: "user1"));

        // Act
        var result = _controller.Simulate(eventId);

        // Assert
        var acceptedResult = Assert.IsType<AcceptedResult>(result);
        Assert.Equal($"/simulate/{eventId}/status", acceptedResult.Location);
    }

    [Fact]
    public async Task Simulate_ShouldThrowInvalidOperationException_WhenNoParticipantsInSimulation()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var simulation = new Simulation(eventId,
                                        [],
                                        new Mock<ISimulationGoal>().Object,
                                        new Mock<ISimulationState>().Object,
                                        new Mock<IWinnerTracker>().Object);

        // Mock the task queue so that it captures the background task and executes it
        _mockTaskQueue.Setup(tq => tq.QueueBackgroundWorkItem(It.IsAny<Guid>(), It.IsAny<Func<CancellationToken, Task>>()))
                      .Callback<Guid, Func<CancellationToken, Task>>((id, task) =>
                      {
                          // Execute the captured task synchronously
                          task(CancellationToken.None).RunSynchronously();
                      });

        _mockSimulationService.Setup(s => s.LoadSimulation(eventId)).ReturnsAsync(simulation);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => Task.Run(() => _controller.Simulate(eventId)));
    }

    [Fact]
    public void CancelSimulation_ShouldReturnOk_WhenSimulationIsCanceled()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        _mockTaskQueue.Setup(t => t.TryCancelSimulation(eventId)).Returns(true);

        // Act
        var result = _controller.CancelSimulation(eventId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal($"Simulation {eventId} canceled.", okResult.Value);
    }

    [Fact]
    public void CancelSimulation_ShouldReturnNotFound_WhenSimulationIsNotFound()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        _mockTaskQueue.Setup(t => t.TryCancelSimulation(eventId)).Returns(false);

        // Act
        var result = _controller.CancelSimulation(eventId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal($"Simulation {eventId} not found.", notFoundResult.Value);
    }

    [Fact]
    public void GetSimulationStatus_ShouldReturnOk_WhenStatusExists()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var simulationStatus = new SimulationStatus(eventId, ["log1", "log2"]);
        _mockStatusTracker.Setup(s => s.GetSimulationStatus(eventId)).Returns(simulationStatus);

        // Act
        var result = _controller.GetSimulationStatus(eventId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var statusResult = Assert.IsType<GetSimulationStatusResponse>(okResult.Value);
        Assert.Equal(eventId, statusResult.EventId);
        Assert.Equal(simulationStatus.Logs, statusResult.Logs);
    }

    [Fact]
    public void GetSimulationStatus_ShouldReturnNotFound_WhenStatusDoesNotExist()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        _mockStatusTracker.Setup(s => s.GetSimulationStatus(eventId)).Returns((SimulationStatus)null);

        // Act
        var result = _controller.GetSimulationStatus(eventId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal($"Simulation {eventId} not found.", notFoundResult.Value);
    }
}
