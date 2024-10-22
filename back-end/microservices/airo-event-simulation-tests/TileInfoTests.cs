using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;
using Moq;

namespace airo_event_simulation_tests;

public class TileInfoTests
{
    [Fact]
    public void SetEmpty_ShouldSetTypeToEmptyAndBotToNull()
    {
        // Arrange
        var tileInfo = new TileInfo { Type = TileType.Wood, Bot = new Mock<ISimulationBot>().Object };

        // Act
        tileInfo.SetEmpty();

        // Assert
        Assert.Equal(TileType.Empty, tileInfo.Type);
        Assert.Null(tileInfo.Bot);
    }

    [Fact]
    public void SetBot_ShouldSetBotAndUpdateType()
    {
        // Arrange
        var bot = new Mock<ISimulationBot>().Object;
        var tileInfo = new TileInfo { Type = TileType.Wood };

        // Act
        tileInfo.SetBot(bot);

        // Assert
        Assert.Equal(TileType.Bot, tileInfo.Type);
        Assert.Equal(bot, tileInfo.Bot);
        Assert.Equal(TileType.Wood, tileInfo.PrevType);
    }

    [Fact]
    public void SetBot_ShouldSetPrevTypeToEmptyIfSpawnPoint()
    {
        // Arrange
        var bot = new Mock<ISimulationBot>().Object;
        var tileInfo = new TileInfo { Type = TileType.SpawnPoint };

        // Act
        tileInfo.SetBot(bot);

        // Assert
        Assert.Equal(TileType.Bot, tileInfo.Type);
        Assert.Equal(bot, tileInfo.Bot);
        Assert.Equal(TileType.Empty, tileInfo.PrevType);
    }

    [Fact]
    public void RestorePrevTile_ShouldRestorePreviousType()
    {
        // Arrange
        var tileInfo = new TileInfo { Type = TileType.Wood };

        var bot = new Mock<ISimulationBot>().Object;
        tileInfo.SetBot(bot);

        // Act
        tileInfo.RestorePrevTile();

        // Assert
        Assert.Equal(TileType.Wood, tileInfo.Type);
        Assert.Equal(TileType.Wood, tileInfo.PrevType);
    }
}
