using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl;

public class Map
{
    public TileInfo[,] Tiles { get; }
    public int Width { get; }
    public int Height { get; }

    // Constructor that initializes the map from a string representation
    public Map(string mapData, int size)
    {
        var rows = mapData.Split("\r\n");
        Height = Width = size;
        Tiles = new TileInfo[Width, Height];

        for (int y = 0; y < Height; y++)
        {
            var cells = rows[y].Replace(" ", "");
            for (int x = 0; x < Width; x++)
            {
                Tiles[x, y] = new TileInfo
                {
                    Type = CharToTileType(cells[x]) // Convert character to TileType
                };
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
                if (Tiles[x, y].Type == TileType.SpawnPoint)
                {
                    spawnPoints.Add(new Position(x, y));
                }
            }
        }
        return spawnPoints;
    }

    public Position GetBotPosition(Bot bot)
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

public class SimulationState(int currentTurn) : ISimulationState
{
    public List<Participant> Participants { get; set; }
    public Map Map { get; set; }
    public int CurrentTurn { get; } = currentTurn;

    public void InitializeSimulation(List<Participant> participants, Map map)
    {
        // get list of spawn points from the map
        var spawnPoints = map.GetSpawnPoints();

        // shuffle the spawn points
        var random = new Random();
        spawnPoints = [.. spawnPoints.OrderBy(x => random.Next())];

        // assign each participant's bot to a spawn point
        for (int i = 0; i < participants.Count; i++)
        {
            participants[i].Bot.Position = new Position(spawnPoints[i]); // assign random spawn point
        }

        // set participants and map to simulation state
        Participants = participants;
        Map = map;
    }

    //public BotState ComputePersonalizedState(Bot bot, Position botPosition, int botHP)
    //{
    //    // Initialize bot state with current HP and position
    //    var botState = new BotState(botHP, botPosition);

    //    // Define vision range (2 tiles in each direction)
    //    int minX = Math.Max(botPosition.X - 2, 0);
    //    int maxX = Math.Min(botPosition.X + 2, Map.Width - 1);
    //    int minY = Math.Max(botPosition.Y - 2, 0);
    //    int maxY = Math.Min(botPosition.Y + 2, Map.Height - 1);

    //    // Loop through the visible tiles
    //    for (int x = minX; x <= maxX; x++)
    //    {
    //        for (int y = minY; y <= maxY; y++)
    //        {
    //            var position = new Position(x, y);
    //            var tileType = Map.Tiles[x, y];

    //            // Check if another bot is on this tile
    //            var otherBot = GetBotAtPosition(position);
    //            if (otherBot != null)
    //            {
    //                botState.VisibleTiles[position] = new TileInfo { Type = TileType.Bot, Bot = otherBot };
    //            }
    //            else
    //            {
    //                botState.VisibleTiles[position] = new TileInfo { Type = tileType };
    //            }
    //        }
    //    }

    //    return botState;
    //}

    //private Bot GetBotAtPosition(Position position)
    //{
    //    return Participants.Select(p => p.Bot).FirstOrDefault(b => b.Position == position);
    //}
}
