namespace airo_event_simulation_domain.Impl.Simulation;

public enum TileType
{
    Bot,
    SpawnPoint,
    Empty,
    Food,
    Wall,
    Water,
    Iron,
    Wood
}

public static class TileTypeExtensions
{
    public static bool CanMoveOn(this TileType tile)
    {
        return tile switch
        {
            TileType.Bot => false,
            TileType.Wall => false,
            TileType.Water => false,
            _ => true,
        };
    }
}
