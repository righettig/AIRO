using airo_event_simulation_domain.Impl.Simulation;

namespace airo_event_simulation_domain.Impl;

public class Map
{
    public TileType[,] Tiles { get; }
    public int Width { get; }
    public int Height { get; }

    // Constructor that initializes the map from a string representation
    public Map(string mapData, int size)
    {
        var rows = mapData.Split("\r\n");
        Height = Width = size;
        Tiles = new TileType[Width, Height];

        for (int y = 0; y < Height; y++)
        {
            var cells = rows[y].Replace(" ", "");
            for (int x = 0; x < Width; x++)
            {
                Tiles[x, y] = CharToTileType(cells[x]); // Convert character to TileType
            }
        }
    }

    // Method to convert a character into the corresponding TileType
    private static TileType CharToTileType(char tileChar)
    {
        return tileChar switch
        {
            'S' => TileType.SpawnPoint,
            '_' => TileType.Empty,
            '~' => TileType.Water,
            'I' => TileType.Iron,
            'W' => TileType.Wood,
            'F' => TileType.Food,
            'X' => TileType.Wall,
            _ => TileType.Empty // Default to Empty for unrecognized characters
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
}
