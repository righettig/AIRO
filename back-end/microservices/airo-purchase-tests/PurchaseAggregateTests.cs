using airo_purchase_microservice.Domain.Aggregates;
using airo_purchase_microservice.Domain.Write.Events;

namespace airo_purchase_tests;

public class PurchaseAggregateTests
{
    [Fact]
    public void PurchaseBot_ShouldRaiseBotPurchasedEvent_WhenBotIsNotAlreadyPurchased()
    {
        // Arrange
        var aggregate = new PurchaseAggregate();
        var userId = Guid.NewGuid();
        var botId = Guid.NewGuid();

        // Act
        aggregate.PurchaseBot(userId, botId);

        // Assert
        var raisedEvents = aggregate.GetUncommittedEvents();
        Assert.Single(raisedEvents); // Only one event should be raised
        var @event = Assert.IsType<BotPurchasedEvent>(raisedEvents[0]);

        Assert.Equal(userId, @event.UserId);
        Assert.Equal(botId, @event.BotId);
    }

    [Fact]
    public void PurchaseBot_ShouldThrowException_WhenBotIsAlreadyPurchased()
    {
        // Arrange
        var aggregate = new PurchaseAggregate();
        var userId = Guid.NewGuid();
        var botId = Guid.NewGuid();

        // Simulate that the bot has already been purchased
        aggregate.PurchaseBot(userId, botId);
        aggregate.MarkEventsAsCommitted(); // This simulates saving the event and clearing uncommitted events.

        // Act & Assert
        var exception = Assert.Throws<InvalidOperationException>(() => aggregate.PurchaseBot(userId, botId));
        Assert.Equal("Cannot buy same bot multiple times", exception.Message);
    }
}

