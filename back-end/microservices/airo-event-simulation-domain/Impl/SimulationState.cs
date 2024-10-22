using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl;

public class SimulationState(int currentTurn) : ISimulationState
{
    public Participant[] Participants { get; set; }
    public TileInfo[,] Tiles { get; private set; }
    public int CurrentTurn { get; set; } = currentTurn;

    public TileInfo GetTileAt(Position position)
    {
        return Tiles[position.X, position.Y];
    }

    public Dictionary<Position, ITileInfo> GetVisibleTiles(Position position, int radius)
    {
        var result = new Dictionary<Position, ITileInfo>();

        var mapSize = Tiles.GetLength(0); // assuming square map

        // Define vision range
        int minX = Math.Max(position.X - radius, 0);
        int maxX = Math.Min(position.X + radius, mapSize - 1);
        int minY = Math.Max(position.Y - radius, 0);
        int maxY = Math.Min(position.Y + radius, mapSize - 1);

        // Loop through the visible tiles
        for (int x = minX; x <= maxX; x++)
        {
            for (int y = minY; y <= maxY; y++)
            {
                result.Add(new Position(x, y), Tiles[x,y]);
            }
        }

        return result;
    }

    public void InitializeSimulation(Participant[] participants, Map map)
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
        for (int i = 0; i < participants.Length; i++)
        {
            var spawnPoint = spawnPoints[i];

            GetTileAt(spawnPoint).SetBot(participants[i].Bot);

            participants[i].Bot.Position = spawnPoint; // assign random spawn point
        }

        // clean up remaining spawn points
        for (int i = participants.Length; i < spawnPoints.Count; i++)
        {
            var spawnPoint = spawnPoints[i];

            GetTileAt(spawnPoint).SetEmpty();
        }
    }
}
