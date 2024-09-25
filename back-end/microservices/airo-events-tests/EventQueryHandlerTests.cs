using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using airo_events_microservice.Domain.Read;
using airo_events_microservice.Domain.Read.Queries;
using airo_events_microservice.Domain.Read.Queries.Handlers;
using Moq;

namespace airo_events_microservice.Tests.Handlers;

public class EventQueryHandlerTests
{
    private readonly Mock<IReadRepository<EventReadModel>> _mockReadRepository;
    private readonly EventQueryHandler _handler;

    public EventQueryHandlerTests()
    {
        _mockReadRepository = new Mock<IReadRepository<EventReadModel>>();
        _handler = new EventQueryHandler(_mockReadRepository.Object);
    }

    [Fact]
    public async Task Handle_GetEventById_ReturnsEvent_WhenFound()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var mockEvent = new EventReadModel { Id = eventId };
        _mockReadRepository.Setup(repo => repo.Entities)
                           .Returns(new List<EventReadModel> { mockEvent }.AsQueryable());

        var query = new GetEventById(eventId);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(eventId, result?.Id);
    }

    [Fact]
    public async Task Handle_GetEventById_ReturnsNull_WhenNotFound()
    {
        // Arrange
        var eventId = Guid.NewGuid(); // Non-existent ID
        _mockReadRepository.Setup(repo => repo.Entities)
                           .Returns(new List<EventReadModel>().AsQueryable()); // No data

        var query = new GetEventById(eventId);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_GetAllEvents_ReturnsAllEvents()
    {
        // Arrange
        var mockEvents = new List<EventReadModel>
        {
            new() { Id = Guid.NewGuid() },
            new() { Id = Guid.NewGuid() },
            new() { Id = Guid.NewGuid() }
        };

        _mockReadRepository.Setup(repo => repo.Entities)
                           .Returns(mockEvents.AsQueryable());

        var query = new GetAllEvents();

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count());
    }

    [Fact]
    public async Task Handle_GetAllEvents_ReturnsEmptyList_WhenNoEvents()
    {
        // Arrange
        _mockReadRepository.Setup(repo => repo.Entities)
                           .Returns(new List<EventReadModel>().AsQueryable());

        var query = new GetAllEvents();

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }
}
