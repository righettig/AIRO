using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_microservice.DTOs;

public record ParticipantDto(string UserId, Guid BotId, int Health);

public record TileInfoDto(TileType Type, Guid? BotId);

public class SimulationStateDto 
{
    public ParticipantDto[] Participants { get; }

    public TileInfoDto[,] Tiles { get; }

    public SimulationStateDto(ISimulation simulation)
    {
        Participants = simulation.Participants
            .Select(x => new ParticipantDto(x.UserId, x.Bot.BotId, x.Bot.Health))
            .ToArray();

        Tiles = MapTilesToDto(simulation.State.Tiles);
    }

    private static TileInfoDto[,] MapTilesToDto(TileInfo[,] tiles)
    {
        int width = tiles.GetLength(0);
        int height = tiles.GetLength(1);
        var tileDtos = new TileInfoDto[width, height];

        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                var tile = tiles[x, y];
                tileDtos[x, y] = new TileInfoDto(tile.Type, tile.Bot?.BotId);
            }
        }

        return tileDtos;
    }
}