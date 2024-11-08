using airo_event_simulation_domain.Impl.Simulation;
using Newtonsoft.Json;

namespace airo_event_simulation_domain.Impl;

public class Map
{
    public TileType[,] Tiles { get; }
    public int Width { get; }
    public int Height { get; }

    // Constructor that initializes the map from a string representation
    public Map(string json)
    {
        MapData? mapData;

        try
        {
            mapData = JsonConvert.DeserializeObject<MapData>(json);
        }
        catch (JsonReaderException) 
        {
            throw new ArgumentException("Invalid map format.");
        }

        if (mapData is null)
        {
            throw new ArgumentException("Invalid map format.");
        }

        Height = Width = mapData.Size;
        Tiles = new TileType[Width, Height];

        // Initialize the map with Empty tiles
        for (int x = 0; x < Width; x++)
        {
            for (int y = 0; y < Height; y++)
            {
                Tiles[x, y] = TileType.Empty;
            }
        }

        // Populate the map with the provided tiles
        foreach (var tile in mapData.Tiles)
        {
            Tiles[tile.X, tile.Y] = CharToTileType(tile.Type);
        }
    }

    private static TileType CharToTileType(string tileType)
    {
        return tileType switch
        {
            "spawn" => TileType.SpawnPoint,
            "empty" => TileType.Empty,
            "water" => TileType.Water,
            "iron"  => TileType.Iron,
            "wood"  => TileType.Wood,
            "food"  => TileType.Food,
            "wall"  => TileType.Wall,
            _       => TileType.Empty // Default to Empty for unrecognized characters
        };
    }

    // Method to return all spawn points on the map
    public List<Position> GetSpawnPoints()
    {
        var spawnPoints = new List<Position>();
        for (int x = 0; x < Width; x++)
        {
            for (int y = 0; y < Height; y++)
            {
                if (Tiles[x, y] == TileType.SpawnPoint)
                {
                    spawnPoints.Add(new Position(x, y));
                }
            }
        }
        return spawnPoints;
    }

    private class MapData
    {
        public required int Size { get; set; }
        public required List<Tile> Tiles { get; set; }
    }

    private class Tile
    {
        public required int X { get; set; }
        public required int Y { get; set; }
        public required string Type { get; set; }
    }
}