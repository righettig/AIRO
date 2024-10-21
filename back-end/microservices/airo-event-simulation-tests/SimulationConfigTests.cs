using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_tests;

public class SimulationConfigTests
{
    [Fact]
    public void Constructor_WithValidParameters_ShouldSetProperties()
    {
        // Arrange
        int botHpInitialAmount = 100;
        int botHpDecayInterval = 10;
        int foodRespawnInterval = 15;
        int botHpDecayAmount = 5;
        int botHpRestoreAmount = 20;

        // Act
        var config = new SimulationConfig(botHpInitialAmount,
                                          botHpDecayInterval,
                                          foodRespawnInterval,
                                          botHpDecayAmount,
                                          botHpRestoreAmount);

        // Assert
        Assert.Equal(botHpInitialAmount, config.BotHpInitialAmount);
        Assert.Equal(botHpDecayInterval, config.BotHpDecayInterval);
        Assert.Equal(foodRespawnInterval, config.FoodRespawnInterval);
        Assert.Equal(botHpDecayAmount, config.BotHpDecayAmount);
        Assert.Equal(botHpRestoreAmount, config.BotHpRestoreAmount);
    }

    [Theory]
    [InlineData(0, 10, 15, 5, 20)]
    [InlineData(100, 0, 15, 5, 20)]
    [InlineData(100, 10, 0, 5, 20)]
    [InlineData(100, 10, 15, 0, 20)]
    [InlineData(100, 10, 15, 5, 0)]
    public void Constructor_WithInvalidParameters_ShouldThrowArgumentException(int botHpInitialAmount,
                                                                               int botHpDecayInterval,
                                                                               int foodRespawnInterval,
                                                                               int botHpDecayAmount,
                                                                               int botHpRestoreAmount)
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new SimulationConfig(botHpInitialAmount,
                                                                    botHpDecayInterval,
                                                                    foodRespawnInterval,
                                                                    botHpDecayAmount,
                                                                    botHpRestoreAmount));
    }
}
