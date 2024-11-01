using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.Simulation.Actions;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Impl;
using airo_event_simulation_engine.Interfaces;
using Moq;

namespace airo_event_simulation_tests;

public class SimulationEngineTests
{
    private readonly Mock<IBehaviourExecutor> _mockBehaviourExecutor;
    private readonly Mock<ISimulationStateUpdater> _mockStateUpdater;
    private readonly Mock<ISimulationRepository> _mockSimulationRepository;
    private readonly Mock<ISimulation> _mockSimulation;
    private readonly Mock<ISimulationGoal> _mockSimulationGoal;
    private readonly Mock<IWinnerTracker> _mockWinnerTracker;

    private readonly SimulationEngine _simulationEngine;

    public SimulationEngineTests()
    {
        _mockBehaviourExecutor = new Mock<IBehaviourExecutor>();
        _mockStateUpdater = new Mock<ISimulationStateUpdater>();
        _mockSimulationRepository = new Mock<ISimulationRepository>();
        _mockSimulation = new Mock<ISimulation>();
        _mockSimulationGoal = new Mock<ISimulationGoal>();
        _mockWinnerTracker = new Mock<IWinnerTracker>();

        _mockSimulation.Setup(s => s.Goal).Returns(_mockSimulationGoal.Object);
        _mockSimulation.Setup(s => s.WinnerTracker).Returns(_mockWinnerTracker.Object);

        _simulationEngine = new SimulationEngine(_mockSimulationRepository.Object, _mockBehaviourExecutor.Object);
    }

    [Fact]
    public async Task RunSimulationAsync_ShouldReturnSuccess_WhenSimulationCompletesWithoutErrors()
    {
        // Arrange
        var simulation = SetupMockSimulation(participantCount: 2, simulationComplete: true);
        _mockWinnerTracker.Setup(w => w.GetWinner(simulation)).Returns((Participant)null);

        // Act
        var result = await _simulationEngine.RunSimulationAsync(simulation, _mockStateUpdater.Object, CancellationToken.None);

        // Assert
        Assert.True(result.Success);
        Assert.Null(result.WinnerUserId);
        Assert.Null(result.ErrorMessage);
    }

    [Fact]
    public async Task RunSimulationAsync_ShouldReturnFailure_WhenExceptionOccurs()
    {
        // Arrange
        var simulation = SetupMockSimulation(participantCount: 2, simulationComplete: false);
        _mockStateUpdater.Setup(e => e.UpdateState(It.IsAny<ISimulation>(), It.IsAny<TimeSpan>(), It.IsAny<Action<string>>()))
            .Throws(new Exception("Test exception"));

        // Act
        var result = await _simulationEngine.RunSimulationAsync(simulation, _mockStateUpdater.Object, CancellationToken.None);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Test exception", result.ErrorMessage);
    }

    [Fact]
    public async Task RunSimulationAsync_ShouldLogMessagesDuringExecution()
    {
        // Arrange
        var mockParticipants = new Participant[2] 
        {
            new("user1", new Bot(Guid.Parse("d6c70321-f0f7-40f5-8760-bd76d3aa2b12"), 100, "return new HoldAction();")),
            new("user2", new Bot(Guid.Parse("ab268f23-140b-4c55-8f40-0b499e2468e1"), 100, "return new MoveAction(Direction.Up);")),
        };

        _mockSimulation.Setup(s => s.GetActiveParticipants()).Returns(mockParticipants);
        _mockSimulation.Setup(s => s.State).Returns(new SimulationState(1));

        _mockSimulationGoal.SetupSequence(g => g.IsSimulationComplete(It.IsAny<ISimulation>()))
            .Returns(false)
            .Returns(true);

        _mockBehaviourExecutor.SetupSequence(e => e.Execute(It.IsAny<string>(), It.IsAny<IBotState>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new HoldAction())
            .ReturnsAsync(new MoveAction(Direction.Up));

        var logs = new List<string>();
        _simulationEngine.OnLogMessage += (sender, message) => logs.Add(message);

        var simulation = _mockSimulation.Object;
        _mockWinnerTracker.Setup(w => w.GetWinner(simulation)).Returns((Participant)null);

        // Act
        await _simulationEngine.RunSimulationAsync(simulation, _mockStateUpdater.Object, CancellationToken.None);

        // Assert
        Assert.Contains("Initializing simulation", logs);
        Assert.Contains("Turn started: 1", logs);
        Assert.Contains("Executed behaviour for bot d6c70321-f0f7-40f5-8760-bd76d3aa2b12, result -> Hold", logs);
        Assert.Contains("Executed behaviour for bot ab268f23-140b-4c55-8f40-0b499e2468e1, result -> Move[Up]", logs);
        Assert.Contains("Turn finished", logs);
        Assert.Contains("Simulation completed. No winner.", logs);
    }

    [Fact]
    public async Task RunSimulationAsync_ShouldLogMessagesDuringExecution_InvalidAction()
    {
        // Arrange
        var mockParticipants = new Participant[1]
        {
            new("user1", new Bot(Guid.Parse("d6c70321-f0f7-40f5-8760-bd76d3aa2b12"), 100, "dummyBehaviourScript1")),
        };

        _mockSimulation.Setup(s => s.GetActiveParticipants()).Returns(mockParticipants);
        _mockSimulation.Setup(s => s.State).Returns(new SimulationState(1));

        _mockSimulationGoal.SetupSequence(g => g.IsSimulationComplete(It.IsAny<ISimulation>()))
            .Returns(false)
            .Returns(true);

        var logs = new List<string>();
        _simulationEngine.OnLogMessage += (sender, message) => logs.Add(message);

        var simulation = _mockSimulation.Object;
        _mockWinnerTracker.Setup(w => w.GetWinner(simulation)).Returns((Participant)null);

        // Act
        await _simulationEngine.RunSimulationAsync(simulation, _mockStateUpdater.Object, CancellationToken.None);

        // Assert
        Assert.Contains("Initializing simulation", logs);
        Assert.Contains("Turn started: 1", logs);
        Assert.Contains("Error: Behavior execution for bot d6c70321-f0f7-40f5-8760-bd76d3aa2b12 did not return a valid action.", logs);
        Assert.Contains("Turn finished", logs);
        Assert.Contains("Simulation completed. No winner.", logs);
    }

    [Fact]
    public async Task RunSimulationAsync_ShouldCancelExecution_WhenTokenIsCancelled()
    {
        // Arrange
        var cts = new CancellationTokenSource();
        var simulation = SetupMockSimulation(participantCount: 2, simulationComplete: false);

        _mockBehaviourExecutor.Setup(e => e.Execute(It.IsAny<string>(), It.IsAny<IBotState>(), It.IsAny<CancellationToken>()))
            .Callback(() => cts.Cancel());

        // Act
        var result = await _simulationEngine.RunSimulationAsync(simulation, _mockStateUpdater.Object, cts.Token);

        Assert.False(result.Success);
        Assert.Equal("The operation was canceled.", result.ErrorMessage);
    }

    [Fact]
    public async Task ExecuteTurnAsync_ShouldExecuteAllParticipantBehaviours()
    {
        // Arrange
        var simulation = SetupMockSimulation(participantCount: 2, turns: 2);

        // Act
        await _simulationEngine.RunSimulationAsync(simulation, _mockStateUpdater.Object, CancellationToken.None);

        // Assert
        _mockBehaviourExecutor.Verify(e => 
            e.Execute(It.IsAny<string>(), It.IsAny<IBotState>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
    }

    private ISimulation SetupMockSimulation(int participantCount, bool simulationComplete)
    {
        var mockParticipants = Enumerable.Range(0, participantCount)
            .Select(i => new Participant($"user{i}", new Bot(Guid.NewGuid(), 100, "dummyBehaviourScript")))
            .ToArray();

        _mockSimulationGoal.Setup(g => g.IsSimulationComplete(It.IsAny<ISimulation>())).Returns(simulationComplete);
        _mockSimulation.Setup(s => s.GetActiveParticipants()).Returns(mockParticipants);
        _mockSimulation.Setup(s => s.State).Returns(new SimulationState(1));

        return _mockSimulation.Object;
    }

    private ISimulation SetupMockSimulation(int participantCount, int turns)
    {
        var mockParticipants = Enumerable.Range(0, participantCount)
            .Select(i => new Participant($"user{i}", new Bot(Guid.NewGuid(), 100, "dummyBehaviourScript")))
            .ToArray();

        var IsSimulationComplete = _mockSimulationGoal.SetupSequence(g => g.IsSimulationComplete(It.IsAny<ISimulation>()));

        for (int i = 0; i < turns - 1; i++)
        {
            IsSimulationComplete.Returns(false);
        }
        IsSimulationComplete.Returns(true);

        _mockSimulation.Setup(s => s.GetActiveParticipants()).Returns(mockParticipants);
        _mockSimulation.Setup(s => s.State).Returns(new SimulationState(1));

        return _mockSimulation.Object;
    }
}