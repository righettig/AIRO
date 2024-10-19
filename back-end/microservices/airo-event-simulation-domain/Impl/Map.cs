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

    //public Position GetBotPosition(Bot bot)
//    {
//        // Logic to find and return the bot's current position on the map
//    }

//    public Dictionary<Position, TileInfo> GetVisibleTiles(Position position, int range)
//    {
//        // Return the tiles visible to the bot from its current position within the specified range
//    }

//    public List<Position> GetAllFoodSpawnLocations()
//    {
//        var foodSpawns = new List<Position>();
//        for (int x = 0; x < _tiles.GetLength(0); x++)
//        {
//            for (int y = 0; y < _tiles.GetLength(1); y++)
//            {
//                if (_tiles[x, y].Type == TileType.Food)
//                {
//                    foodSpawns.Add(new Position(x, y));
//                }
//            }
//        }
//        return foodSpawns;
//    }

//    public void SpawnFood(Position position)
//    {
//        _tiles[position.X, position.Y].Type = TileType.Food;
//    }

//    public bool IsValidPosition(Position position)
//    {
//        // Check if the position is within bounds and not blocked by walls, etc.
//        return position.X >= 0 && position.X < _tiles.GetLength(0) &&
//               position.Y >= 0 && position.Y < _tiles.GetLength(1) &&
//               _tiles[position.X, position.Y].Type != TileType.Wall;
//    }

//    public void MoveBot(Bot bot, Position oldPosition, Position newPosition)
//    {
//        // Update the bot's position on the map
//        _tiles[oldPosition.X, oldPosition.Y].Bot = null; // Remove bot from old position
//        _tiles[newPosition.X, newPosition.Y].Bot = bot;  // Place bot in the new position
//    }

//    public Tile GetTile(Position position)
//    {
//        return _tiles[position.X, position.Y];
//    }

//    public void RemoveFood(Position position)
//    {
//        _tiles[position.X, position.Y].Type = TileType.Empty; // Remove food from the tile
//    }
}
