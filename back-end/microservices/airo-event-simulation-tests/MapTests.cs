using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_tests;

public class MapTests
{
    [Fact]
    public void Constructor_ShouldInitializeMapCorrectly()
    {
        // Arrange
        string mapData = @"
        {
          ""size"": 3,
          ""tiles"": [
            {
              ""x"": 0,
              ""y"": 0,
              ""type"": ""spawn""
            },
            {
              ""x"": 2,
              ""y"": 0,
              ""type"": ""water""
            },
            {
              ""x"": 0,
              ""y"": 1,
              ""type"": ""iron""
            },
	        {
              ""x"": 1,
              ""y"": 1,
              ""type"": ""wood""
            },
	        {
              ""x"": 2,
              ""y"": 1,
              ""type"": ""food""
            },
	        {
              ""x"": 0,
              ""y"": 2,
              ""type"": ""wall""
            },
          ]
        }";
        int size = 3;

        // Act
        var map = new Map(mapData);

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
    public void Constructor_Should_Throw_ArgumentException_When_No_Data()
    {
        Assert.Throws<ArgumentException>(() => new Map(""));
    }

    [Fact]
    public void Constructor_Should_Throw_ArgumentException_When_Invalid_Format()
    {
        Assert.Throws<ArgumentException>(() => new Map("S _ ~\r\nI W F\r\nX _ _"));
    }

    [Fact]
    public void GetSpawnPoints_ShouldReturnAllSpawnPoints()
    {
        // Arrange
        string mapData = @"
        {
          ""size"": 3,
          ""tiles"": [
            {
              ""x"": 0,
              ""y"": 0,
              ""type"": ""spawn""
            },
            {
              ""x"": 2,
              ""y"": 0,
              ""type"": ""water""
            },
            {
              ""x"": 0,
              ""y"": 1,
              ""type"": ""iron""
            },
	        {
              ""x"": 1,
              ""y"": 1,
              ""type"": ""wood""
            },
	        {
              ""x"": 2,
              ""y"": 1,
              ""type"": ""food""
            },
	        {
              ""x"": 0,
              ""y"": 2,
              ""type"": ""spawn""
            },
          ]
        }";
        var map = new Map(mapData);

        // Act
        var spawnPoints = map.GetSpawnPoints();

        // Assert
        Assert.Equal(2, spawnPoints.Count);
        Assert.Contains(new Position(0, 0), spawnPoints);
        Assert.Contains(new Position(0, 2), spawnPoints);
    }
}
