using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;
using Moq;

namespace airo_event_simulation_tests;

public class BotTests
{
    [Fact]
    public void Constructor_ShouldInitializeBotWithCorrectProperties()
    {
        // Arrange
        var botId = Guid.NewGuid();
        var botAgent = new Mock<IBotAgent>().Object;

        // Act
        var bot = new Bot(botId, 100, botAgent);

        // Assert
        Assert.Equal(botId, bot.BotId);
        Assert.Equal(100, bot.Health);
        Assert.Equal(botAgent, bot.BotAgent);
    }

    [Fact]
    public void Constructor_ShouldThrowException_WhenBotAgentIsNull()
    {
        // Arrange
        var botId = Guid.NewGuid();

        // Act & Assert
        var exceptionNull = Assert.Throws<ArgumentNullException>(() => new Bot(botId, 100, null));
        Assert.Equal("Value cannot be null. (Parameter 'botAgent')", exceptionNull.Message);
    }
}