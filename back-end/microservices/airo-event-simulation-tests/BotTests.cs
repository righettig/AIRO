using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_tests;

public class BotTests
{
    [Fact]
    public void Constructor_ShouldInitializeBotWithCorrectProperties()
    {
        // Arrange
        var botId = Guid.NewGuid();
        var behaviorScript = "attack();";

        // Act
        var bot = new Bot(botId, 100, behaviorScript);

        // Assert
        Assert.Equal(botId, bot.BotId);
        Assert.Equal(100, bot.Health);
        Assert.Equal(behaviorScript, bot.BehaviorScript);
    }

    [Fact]
    public void Constructor_ShouldThrowException_WhenBehaviorScriptIsNullOrEmpty()
    {
        // Arrange
        var botId = Guid.NewGuid();

        // Act & Assert
        var exceptionNull = Assert.Throws<ArgumentNullException>(() => new Bot(botId, 100, null));
        Assert.Equal("Value cannot be null. (Parameter 'behaviorScript')", exceptionNull.Message);

        var exceptionEmpty = Assert.Throws<ArgumentException>(() => new Bot(botId, 100, ""));
        Assert.Equal("The value cannot be an empty string. (Parameter 'behaviorScript')", exceptionEmpty.Message);
    }

    [Fact]
    public void Constructor_ShouldCreateBot_WhenValidBehaviorScriptIsProvided()
    {
        // Arrange
        var botId = Guid.NewGuid();
        var behaviorScript = "defend();";

        // Act
        var bot = new Bot(botId, 100, behaviorScript);

        // Assert
        Assert.Equal(botId, bot.BotId);
        Assert.Equal(behaviorScript, bot.BehaviorScript);
    }
}