using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl;

public class SimulationState(int currentTurn) : ISimulationState
{
    public List<Participant> Participants { get; set; }
    public TileInfo[,] Tiles { get; private set; }
    public int CurrentTurn { get; } = currentTurn;

    public void InitializeSimulation(List<Participant> participants, Map map)
    {
        // get list of spawn points from the map
        var spawnPoints = map.GetSpawnPoints();

        // shuffle the spawn points
        var random = new Random();
        spawnPoints = [.. spawnPoints.OrderBy(x => random.Next())];

        // set participants and map to simulation state
        Participants = participants;

        Tiles = new TileInfo[map.Width, map.Height];

        for (int x = 0; x < map.Width; x++)
        {
            for (int y = 0; y < map.Height; y++)
            {
                // Clone each TileInfo instance into the new map
                Tiles[x, y] = new TileInfo
                {
                    Type = map.Tiles[x, y]
                };
            }
        }

        // assign each participant's bot to a spawn point
        for (int i = 0; i < participants.Count; i++)
        {
            var spawnPoint = spawnPoints[i];

            Tiles[spawnPoint.X, spawnPoint.Y].Type = TileType.Bot;
            Tiles[spawnPoint.X, spawnPoint.Y].Bot = participants[i].Bot;

            participants[i].Bot.Position = spawnPoint; // assign random spawn point
        }

        // clean up remaining spawn points
        for (int i = participants.Count; i < spawnPoints.Count; i++)
        {
            var spawnPoint = spawnPoints[i];
            Tiles[spawnPoint.X, spawnPoint.Y].Type = TileType.Empty;
        }
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
