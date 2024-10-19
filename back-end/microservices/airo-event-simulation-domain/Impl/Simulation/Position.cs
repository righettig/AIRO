namespace airo_event_simulation_domain.Impl.Simulation;

public enum TileType
{
    Bot,
    SpawnPoint,
    Empty,
    Food
}

public class TileInfo
{
    public TileType Type { get; set; }
    //public required Bot Bot { get; set; } // Only used if there's a bot on the tile
}

public record Position(int X, int Y);
