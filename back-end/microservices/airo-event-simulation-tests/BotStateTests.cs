using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;
using Moq;

namespace airo_event_simulation_tests;

public class BotStateTests
{
    [Fact]
    public void Constructor_ShouldSetProperties()
    {
        // Arrange
        var botId = Guid.NewGuid();
        var health = 100;
        var attack = 10;
        var defense = 1;
        var position = new Position(0, 0);
        var visibleTiles = new Dictionary<Position, ITileInfo>();

        // Act
        var botState = new BotState(botId, health, attack, defense, position, visibleTiles);

        // Assert
        Assert.Equal(botId, botState.Id);
        Assert.Equal(health, botState.Health);
        Assert.Equal(attack, botState.Attack);
        Assert.Equal(defense, botState.Defense);
        Assert.Equal(position, botState.Position);
        Assert.Equal(visibleTiles, botState.VisibleTiles);
    }

    [Fact]
    public void GetNearestOpponentBot_ShouldReturnNullWhenNoBots()
    {
        // Arrange
        var botId = Guid.NewGuid();
        var position = new Position(0, 0);
        var visibleTiles = new Dictionary<Position, ITileInfo>();
        var botState = new BotState(botId, 100, 10, 1, position, visibleTiles);

        // Act
        var nearestBot = botState.GetNearestOpponentBot();

        // Assert
        Assert.Null(nearestBot);
    }

    [Fact]
    public void GetNearestFoodTile_ShouldReturnNullWhenNoFood()
    {
        // Arrange
        var botId = Guid.NewGuid();
        var position = new Position(0, 0);
        var visibleTiles = new Dictionary<Position, ITileInfo>();
        var botState = new BotState(botId, 100, 10, 1, position, visibleTiles);

        // Act
        var nearestFood = botState.GetNearestFoodTile();

        // Assert
        Assert.Null(nearestFood);
    }

    [Fact]
    public void GetNearestOpponentBot_ShouldReturnNearestBot()
    {
        // Arrange
        var botId = Guid.NewGuid();
        var position = new Position(0, 0);

        var bot1 = new Mock<ISimulationBot>();
        var bot1Position = new Position(1, 1);

        var bot2 = new Mock<ISimulationBot>();
        var bot2Position = new Position(0, 1);

        var tile1Info = new Mock<ITileInfo>();
        tile1Info.Setup(t => t.Type).Returns(TileType.Bot);
        tile1Info.Setup(t => t.Bot).Returns(bot1.Object);

        var tile2Info = new Mock<ITileInfo>();
        tile2Info.Setup(t => t.Type).Returns(TileType.Bot);
        tile2Info.Setup(t => t.Bot).Returns(bot2.Object);

        var visibleTiles = new Dictionary<Position, ITileInfo>
        {
            { bot1Position, tile1Info.Object },
            { bot2Position, tile2Info.Object }
        };
        var botState = new BotState(botId, 100, 10, 1, position, visibleTiles);

        // Act
        var nearestBot = botState.GetNearestOpponentBot();

        // Assert
        Assert.NotNull(nearestBot);
        Assert.Equal(bot2.Object, nearestBot);
    }

    [Fact]
    public void GetNearestFoodTile_ShouldReturnNearestFood()
    {
        // Arrange
        var botId = Guid.NewGuid();
        var position = new Position(0, 0);

        var food1Position = new Position(1, 1);
        var tile1Info = new Mock<ITileInfo>();
        tile1Info.Setup(t => t.Type).Returns(TileType.Food);

        var food2Position = new Position(1, 0);
        var tile2Info = new Mock<ITileInfo>();
        tile2Info.Setup(t => t.Type).Returns(TileType.Food);

        var visibleTiles = new Dictionary<Position, ITileInfo>
        {
            { food1Position, tile1Info.Object },
            { food2Position, tile2Info.Object }
        };
        var botState = new BotState(botId, 100, 10, 1, position, visibleTiles);

        // Act
        var nearestFood = botState.GetNearestFoodTile();

        // Assert
        Assert.NotNull(nearestFood);
        Assert.Equal(food2Position, nearestFood);
    }
}
