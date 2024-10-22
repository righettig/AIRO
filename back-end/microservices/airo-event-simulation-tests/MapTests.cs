using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_tests;

public class MapTests
{
    [Fact]
    public void Constructor_ShouldInitializeMapCorrectly()
    {
        // Arrange
        string mapData = "S _ ~\r\nI W F\r\nX _ _";
        int size = 3;

        // Act
        var map = new Map(mapData, size);

        // Assert
        Assert.Equal(size, map.Width);
        Assert.Equal(size, map.Height);
        Assert.Equal(TileType.SpawnPoint, map.Tiles[0, 0]);
        Assert.Equal(TileType.Empty, map.Tiles[1, 0]);
        Assert.Equal(TileType.Water, map.Tiles[2, 0]);
        Assert.Equal(TileType.Iron, map.Tiles[0, 1]);
        Assert.Equal(TileType.Wood, map.Tiles[1, 1]);
        Assert.Equal(TileType.Food, map.Tiles[2, 1]);
        Assert.Equal(TileType.Wall, map.Tiles[0, 2]);
        Assert.Equal(TileType.Empty, map.Tiles[1, 2]);
        Assert.Equal(TileType.Empty, map.Tiles[2, 2]);
    }

    [Fact]
    public void GetSpawnPoints_ShouldReturnAllSpawnPoints()
    {
        // Arrange
        string mapData = "S _ ~\r\nI W F\r\nS _ _";
        int size = 3;
        var map = new Map(mapData, size);

        // Act
        var spawnPoints = map.GetSpawnPoints();

        // Assert
        Assert.Equal(2, spawnPoints.Count);
        Assert.Contains(new Position(0, 0), spawnPoints);
        Assert.Contains(new Position(0, 2), spawnPoints);
    }
}
