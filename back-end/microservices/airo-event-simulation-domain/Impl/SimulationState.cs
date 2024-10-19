using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl;

//public class Map
//{
//    private TileInfo[,] _tiles;

//    public Map(TileInfo[,] tiles)
//    {
//        _tiles = tiles;
//    }

//    public int Width { get; internal set; }
//    public int Height { get; internal set; }

//    public Position GetBotPosition(Bot bot)
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
//}

public class SimulationState(int currentTurn) : ISimulationState
{
    public List<Participant> Participants { get; set; }
    //public Map Map { get; set; }
    public int CurrentTurn { get; } = currentTurn;

    //public void InitializeSimulation(List<Participant> participants, Map map)
    //{
    //    // Get list of spawn points from the map
    //    var spawnPoints = GetSpawnPoints(map);

    //    // Shuffle the spawn points
    //    var random = new Random();
    //    spawnPoints = spawnPoints.OrderBy(x => random.Next()).ToList();

    //    // Assign each participant's bot to a spawn point
    //    for (int i = 0; i < participants.Count; i++)
    //    {
    //        participants[i].Bot.HP = 100; // Initialize HP to 100
    //        participants[i].Bot.Position = spawnPoints[i]; // Assign random spawn point
    //    }

    //    // Set participants and map to simulation state
    //    Participants = participants;
    //    Map = map;
    //}

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

    //private List<Position> GetSpawnPoints(Map map)
    //{
    //    var spawnPoints = new List<Position>();
    //    for (int x = 0; x < map.Width; x++)
    //    {
    //        for (int y = 0; y < map.Height; y++)
    //        {
    //            if (map.Tiles[x, y] == TileType.SpawnPoint)
    //            {
    //                spawnPoints.Add(new Position(x, y));
    //            }
    //        }
    //    }
    //    return spawnPoints;
    //}
}
