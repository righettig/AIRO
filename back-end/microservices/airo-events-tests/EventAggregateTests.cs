using airo_events_microservice.Domain.Aggregates;
using airo_events_microservice.Domain.Write.Events;

namespace airo_events_tests;

public class EventAggregateTests
{
    private readonly EventAggregate _eventAggregate;

    public EventAggregateTests()
    {
        _eventAggregate = new EventAggregate();
    }

    [Fact]
    public void CreateEvent_ShouldRaiseEventCreatedEvent()
    {
        // Arrange
        var id = Guid.NewGuid();
        var name = "Sample Event";
        var description = "Event Description";
        var scheduledAt = DateTime.Now;
        var mapId = Guid.NewGuid();

        // Act
        _eventAggregate.CreateEvent(id, name, description, scheduledAt, mapId);

        // Assert
        var raisedEvents = _eventAggregate.GetUncommittedEvents();
        Assert.Single(raisedEvents);
        Assert.IsType<EventCreatedEvent>(raisedEvents[0]);

        var @event = (EventCreatedEvent)raisedEvents[0];
        Assert.Equal(id, @event.Id);
        Assert.Equal(name, @event.Name);
        Assert.Equal(description, @event.Description);
        Assert.Equal(scheduledAt, @event.ScheduledAt);
        Assert.Equal(mapId, @event.MapId);
    }

    [Fact]
    public void DeleteEvent_ShouldRaiseEventDeletedEvent()
    {
        // Arrange
        var id = Guid.NewGuid();

        // Act
        _eventAggregate.DeleteEvent(id);

        // Assert
        var raisedEvents = _eventAggregate.GetUncommittedEvents();
        Assert.Single(raisedEvents);
        Assert.IsType<EventDeletedEvent>(raisedEvents[0]);

        var @event = (EventDeletedEvent)raisedEvents[0];
        Assert.Equal(id, @event.Id);
    }

    [Fact]
    public void UpdateEvent_ShouldRaiseEventUpdatedEvent()
    {
        // Arrange
        var id = Guid.NewGuid();
        var name = "Updated Event";
        var description = "Updated Description";
        var newStartTime = DateTime.Now;
        var mapId = Guid.NewGuid(); 

        // Act
        _eventAggregate.UpdateEvent(id, name, description, newStartTime, mapId);

        // Assert
        var raisedEvents = _eventAggregate.GetUncommittedEvents();
        Assert.Single(raisedEvents);
        Assert.IsType<EventUpdatedEvent>(raisedEvents[0]);

        var @event = (EventUpdatedEvent)raisedEvents[0];
        Assert.Equal(id, @event.Id);
        Assert.Equal(name, @event.Name);
        Assert.Equal(description, @event.Description);
        Assert.Equal(mapId, @event.MapId);
    }

    [Fact]
    public void StartEvent_ShouldRaiseEventStartedEvent_WhenEventIsNotStarted()
    {
        // Arrange
        var id = Guid.NewGuid();

        // Act
        _eventAggregate.CreateEvent(id, "Event", "Description", DateTime.Now, Guid.NewGuid()); // Event created
        _eventAggregate.StartEvent(id);

        // Assert
        var raisedEvents = _eventAggregate.GetUncommittedEvents();
        Assert.Equal(2, raisedEvents.Count); // One for creation, one for starting

        var @event = (EventStartedEvent)raisedEvents[1];
        Assert.IsType<EventStartedEvent>(@event);
        Assert.Equal(id, @event.Id);
    }

    [Fact]
    public void StartEvent_ShouldThrowInvalidOperationException_WhenEventIsAlreadyStarted()
    {
        // Arrange
        var id = Guid.NewGuid();

        // Act
        _eventAggregate.CreateEvent(id, "Event", "Description", DateTime.Now, Guid.NewGuid());
        _eventAggregate.StartEvent(id);

        // Assert
        Assert.Throws<InvalidOperationException>(() => _eventAggregate.StartEvent(id));
    }

    [Fact]
    public void CompletedEvent_ShouldRaiseEventCompletedEvent_WhenEventIsStarted()
    {
        // Arrange
        var id = Guid.NewGuid();
        var winnerUserId = "user-123";

        // Act
        _eventAggregate.CreateEvent(id, "Event", "Description", DateTime.Now, Guid.NewGuid());
        _eventAggregate.StartEvent(id);
        _eventAggregate.CompletedEvent(id, winnerUserId);

        // Assert
        var raisedEvents = _eventAggregate.GetUncommittedEvents();
        Assert.Equal(3, raisedEvents.Count); // Created, Started, Completed

        var @event = (EventCompletedEvent)raisedEvents[2];
        Assert.IsType<EventCompletedEvent>(@event);
        Assert.Equal(id, @event.Id);
        Assert.Equal(winnerUserId, @event.WinnerUserId);
    }

    [Fact]
    public void CompletedEvent_ShouldThrowInvalidOperationException_WhenEventIsNotStarted()
    {
        // Arrange
        var id = Guid.NewGuid();
        var winnerUserId = "user-123";

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => _eventAggregate.CompletedEvent(id, winnerUserId));
    }

    [Fact]
    public void CompletedEvent_ShouldThrowInvalidOperationException_WhenEventIsAlreadyCompleted()
    {
        // Arrange
        var id = Guid.NewGuid();
        var winnerUserId = "user-123";

        // Act
        _eventAggregate.CreateEvent(id, "Event", "Description", DateTime.Now, Guid.NewGuid());
        _eventAggregate.StartEvent(id);
        _eventAggregate.CompletedEvent(id, winnerUserId);

        // Assert
        Assert.Throws<InvalidOperationException>(() => _eventAggregate.CompletedEvent(id, winnerUserId));
    }
}