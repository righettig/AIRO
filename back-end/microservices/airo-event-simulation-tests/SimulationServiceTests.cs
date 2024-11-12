using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.SimulationGoals;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_infrastructure.Impl;
using airo_event_simulation_infrastructure.Interfaces;
using airo_event_simulation_microservice.Services.Interfaces;
using Moq;
using System.Reflection;

namespace airo_event_simulation_tests;

public class SimulationServiceTests
{
    private readonly Mock<ISimulationStateFactory> _simulationStateFactoryMock;
    private readonly Mock<ISimulationConfig> _simulationConfigMock;
    private readonly Mock<IEventSubscriptionService> _eventSubscriptionServiceMock;
    private readonly Mock<IEventsService> _eventsServiceMock;
    private readonly Mock<IMapsService> _mapsServiceMock;
    private readonly Mock<IRedisCache> _redisCacheServiceMock;
    private readonly Mock<IBotAgentFactory> _botAgentFactoryMock;
    private readonly Mock<IBotsService> _botsServiceMock;
    private readonly Mock<IMapFactory> _mapFactoryMock;

    private readonly string mapString = @"
    {
      ""size"": 4,
      ""tiles"": [
        {
          ""x"": 0,
          ""y"": 0,
          ""type"": ""spawn""
        },
        {
          ""x"": 2,
          ""y"": 0,
          ""type"": ""wall""
        },
        {
          ""x"": 1,
          ""y"": 1,
          ""type"": ""food""
        },
        {
          ""x"": 1,
          ""y"": 2,
          ""type"": ""wood""
        },
        {
          ""x"": 3,
          ""y"": 2,
          ""type"": ""water""
        },
        {
          ""x"": 0,
          ""y"": 3,
          ""type"": ""iron""
        },
        {
          ""x"": 3,
          ""y"": 3,
          ""type"": ""spawn""
        }
      ]
    }";

    private readonly SimulationService _simulationService;

    public SimulationServiceTests()
    {
        _simulationStateFactoryMock = new Mock<ISimulationStateFactory>();
        _simulationConfigMock = new Mock<ISimulationConfig>();
        _eventSubscriptionServiceMock = new Mock<IEventSubscriptionService>();
        _eventsServiceMock = new Mock<IEventsService>();
        _mapsServiceMock = new Mock<IMapsService>();
        _redisCacheServiceMock = new Mock<IRedisCache>();
        _botAgentFactoryMock = new Mock<IBotAgentFactory>();
        _mapFactoryMock = new Mock<IMapFactory>();
        _mapFactoryMock = new Mock<IMapFactory>();
        _botsServiceMock = new Mock<IBotsService>();

        _simulationService = new SimulationService(_simulationConfigMock.Object,
                                                   _simulationStateFactoryMock.Object,
                                                   _redisCacheServiceMock.Object,
                                                   _botAgentFactoryMock.Object,
                                                   _mapFactoryMock.Object,
                                                   _eventSubscriptionServiceMock.Object,
                                                   _eventsServiceMock.Object,
                                                   _mapsServiceMock.Object,
                                                   _botsServiceMock.Object);
    }

    [Fact]
    public async Task LoadSimulation_ShouldLoadSimulationWithCorrectMapAndParticipants()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var mapId = Guid.NewGuid();
        var mapString = "map data";
        var botBehaviourId = Guid.NewGuid();
        var botId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var participant = new EventSubscriptionDto { 
            BotBehaviourId = botBehaviourId,
            BotId = botId, 
            UserId = userId.ToString(),
        };

        _eventsServiceMock.Setup(s => s.GetMapId(eventId)).ReturnsAsync(mapId);
        _mapsServiceMock.Setup(s => s.GetMapById(mapId)).ReturnsAsync(mapString);
        _eventSubscriptionServiceMock.Setup(s => s.GetParticipants(eventId)).ReturnsAsync([participant]);
        _redisCacheServiceMock.Setup(s => s.GetDllAsync(botBehaviourId.ToString())).ReturnsAsync(
            File.ReadAllBytes(Assembly.GetExecutingAssembly().Location));

        _botsServiceMock.Setup(s => s.GetBotById(It.IsAny<Guid>())).Returns(Task.FromResult(new BotDto { Id = botId }));
        _botAgentFactoryMock.Setup(f => f.Create(It.IsAny<Assembly>())).Returns(new Mock<IBotAgent>().Object);
        _simulationConfigMock.SetupGet(c => c.BotHpInitialAmount).Returns(100);
        _simulationStateFactoryMock.Setup(
            f => f.Create(It.IsAny<Participant[]>(), It.IsAny<Map>())).Returns(Mock.Of<ISimulationState>());

        // Act
        var simulation = await _simulationService.LoadSimulation(eventId);

        // Assert
        Assert.NotNull(simulation);
        Assert.Equal(eventId, simulation.EventId);
        Assert.Single(simulation.Participants);
        Assert.All(simulation.Participants, p => Assert.NotNull(p.Bot));
        Assert.Equal(userId.ToString(), simulation.Participants[0].UserId);
        Assert.Equal(participant.BotId, simulation.Participants[0].Bot.BotId);
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

        var mapId = Guid.NewGuid();

        _eventsServiceMock
            .Setup(x => x.GetMapId(It.IsAny<Guid>()))
            .ReturnsAsync(mapId);

        _mapsServiceMock
            .Setup(x => x.GetMapById(It.Is<Guid>(y => y == mapId)))
            .ReturnsAsync(mapString);

        // Act
        var simulation = await _simulationService.LoadSimulation(eventId);

        // Assert
        Assert.NotNull(simulation);
        Assert.Equal(eventId, simulation.EventId);
        Assert.Empty(simulation.Participants);
    }

    [Fact]
    public async Task LoadSimulation_ShouldThrowException_WhenGetMapIdFails()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        _eventsServiceMock.Setup(s => s.GetMapId(eventId)).ThrowsAsync(new Exception("Invalid map ID"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _simulationService.LoadSimulation(eventId));
    }

    [Fact]
    public async Task LoadSimulation_ShouldThrowException_WhenGetMapByIdFails()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var mapId = Guid.NewGuid();
        _eventsServiceMock.Setup(s => s.GetMapId(eventId)).ReturnsAsync(mapId);
        _mapsServiceMock.Setup(s => s.GetMapById(mapId)).ThrowsAsync(new Exception("Map not found"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _simulationService.LoadSimulation(eventId));
    }

    [Fact]
    public async Task LoadSimulation_ShouldThrowException_WhenGetParticipantsFails()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var mapId = Guid.NewGuid();
        _eventsServiceMock.Setup(s => s.GetMapId(eventId)).ReturnsAsync(mapId);
        _mapsServiceMock.Setup(s => s.GetMapById(mapId)).ReturnsAsync("map data");
        _eventSubscriptionServiceMock.Setup(s => s.GetParticipants(eventId)).ThrowsAsync(new Exception("Failed to retrieve participants"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _simulationService.LoadSimulation(eventId));
    }

    [Fact]
    public async Task GetBotBehaviourAssembly_ShouldLoadAssemblyFromCache()
    {
        // Arrange
        var botBehaviourId = Guid.NewGuid();
        var assemblyBytes = File.ReadAllBytes(Assembly.GetExecutingAssembly().Location);
        _redisCacheServiceMock.Setup(s => s.GetDllAsync(botBehaviourId.ToString())).ReturnsAsync(assemblyBytes);

        // Act
        var assembly = await _simulationService.GetBotBehaviourAssembly(botBehaviourId);

        // Assert
        Assert.NotNull(assembly);
        _redisCacheServiceMock.Verify(s => s.GetDllAsync(botBehaviourId.ToString()), Times.Once);
    }

    [Fact]
    public async Task GetBotBehaviourAssembly_ShouldThrowException_WhenAssemblyNotInCache()
    {
        // Arrange
        var botBehaviourId = Guid.NewGuid();
        _redisCacheServiceMock.Setup(s => s.GetDllAsync(botBehaviourId.ToString())).ReturnsAsync((byte[])null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => _simulationService.GetBotBehaviourAssembly(botBehaviourId));
    }
}