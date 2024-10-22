using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_infrastructure.Impl;
using airo_event_simulation_infrastructure.Interfaces;
using Moq;

namespace airo_event_simulation_tests;

public class SimulationServiceTests
{
    private readonly Mock<ISimulationStateFactory> _simulationStateFactoryMock;
    private readonly Mock<ISimulationConfig> _simulationConfigMock;
    private readonly Mock<IBotBehavioursService> _botBehavioursServiceMock;
    private readonly Mock<IEventSubscriptionService> _eventSubscriptionServiceMock;

    private readonly SimulationService _simulationService;

    public SimulationServiceTests()
    {
        _simulationStateFactoryMock = new Mock<ISimulationStateFactory>();
        _simulationConfigMock = new Mock<ISimulationConfig>();
        _botBehavioursServiceMock = new Mock<IBotBehavioursService>();
        _eventSubscriptionServiceMock = new Mock<IEventSubscriptionService>();

        _simulationService = new SimulationService(_simulationConfigMock.Object,
                                                   _simulationStateFactoryMock.Object,
                                                   _botBehavioursServiceMock.Object,
                                                   _eventSubscriptionServiceMock.Object);
    }

    [Fact]
    public async Task LoadSimulation_ShouldReturnSimulation_WhenParticipantsAreFetched()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var participants = new List<EventSubscriptionDto>
        {
            new() { UserId = "user1", BotBehaviourId = Guid.NewGuid(), BotId = Guid.NewGuid() },
            new() { UserId = "user2", BotBehaviourId = Guid.NewGuid(), BotId = Guid.NewGuid() }
        };

        _eventSubscriptionServiceMock
            .Setup(es => es.GetParticipants(eventId))
            .ReturnsAsync([.. participants]);

        _botBehavioursServiceMock
            .Setup(bh => bh.GetBotBehaviour(It.IsAny<string>(), It.IsAny<Guid>()))
            .ReturnsAsync("BehaviorScript");

        // Act
        var simulation = await _simulationService.LoadSimulation(eventId);

        // Assert
        Assert.NotNull(simulation);
        Assert.Equal(eventId, simulation.EventId);
        Assert.Equal(2, simulation.Participants.Length);
        Assert.All(simulation.Participants, p => Assert.NotNull(p.Bot));
        Assert.Equal("user1", simulation.Participants[0].UserId);
        Assert.Equal("user2", simulation.Participants[1].UserId);
        Assert.Equal(participants[0].BotId, simulation.Participants[0].Bot.BotId);
        Assert.Equal(participants[1].BotId, simulation.Participants[1].Bot.BotId);
        Assert.IsType<TurnBasedGoal>(simulation.Goal);
    }

    [Fact]
    public async Task LoadSimulation_ShouldHandleNoParticipants()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var participants = new List<EventSubscriptionDto>();

        _eventSubscriptionServiceMock
            .Setup(es => es.GetParticipants(eventId))
            .ReturnsAsync([.. participants]);

        // Act
        var simulation = await _simulationService.LoadSimulation(eventId);

        // Assert
        Assert.NotNull(simulation);
        Assert.Equal(eventId, simulation.EventId);
        Assert.Empty(simulation.Participants);
    }

    [Fact]
    public async Task LoadSimulation_ShouldThrowException_WhenFetchingBotBehaviourFails()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var participants = new List<EventSubscriptionDto>
        {
            new() { UserId = "user1", BotBehaviourId = Guid.NewGuid(), BotId = Guid.NewGuid() }
        };

        _eventSubscriptionServiceMock
            .Setup(es => es.GetParticipants(eventId))
            .ReturnsAsync([.. participants]);

        _botBehavioursServiceMock
            .Setup(bh => bh.GetBotBehaviour(It.IsAny<string>(), It.IsAny<Guid>()))
            .ThrowsAsync(new Exception("Error fetching bot behaviour"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(async () => await _simulationService.LoadSimulation(eventId));
    }
}