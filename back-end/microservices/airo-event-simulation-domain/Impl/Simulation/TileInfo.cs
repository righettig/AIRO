﻿using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_domain.Impl.Simulation;

public class TileInfo : ITileInfo
{
    public TileType Type { get; set; }
    
    // useful for when a Bot is leaving a tile without picking up an item or consuming a resource
    // or when a Bot goes onto a Water/Wall type and we need to restore the tile content when it leaves the tile.
    public TileType PrevType { get; private set; }

    public ISimulationBot? Bot { get; set; } // Only used if there's a bot on the tile

    public void SetEmpty()
    {
        Type = TileType.Empty;
        Bot = null;
    }

    public void SetBot(ISimulationBot bot)
    {
        if (Type == TileType.SpawnPoint) // We do not want to carry over this info while the simulation is running
        {
            PrevType = TileType.Empty;
        }
        else 
        {
            PrevType = Type;
        }

        Type = TileType.Bot;
        Bot = bot;
    }

    public void RestorePrevTile() 
    {
        Type = PrevType;
        PrevType = Type;
    }
}
