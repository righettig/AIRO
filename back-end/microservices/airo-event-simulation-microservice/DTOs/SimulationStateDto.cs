using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

namespace airo_event_simulation_microservice.DTOs;

public record ParticipantDto(string UserId, string Nickname, Guid BotId, int Health);

public record TileInfoDto(TileType Type, Guid? BotId);

public class SimulationStateDto
{
    public ParticipantDto[] Participants { get; }
    public List<List<TileInfoDto>> Tiles { get; }

    public SimulationStateDto(ISimulation simulation)
    {
        Participants = simulation.Participants
            .Select(x => new ParticipantDto(x.UserId, x.Nickname, x.Bot.BotId, x.Bot.Health))
            .ToArray();

        Tiles = MapTilesToDto(simulation.State.Tiles);
    }

    private static List<List<TileInfoDto>> MapTilesToDto(TileInfo[,] tiles)
    {
        int width = tiles.GetLength(0);
        int height = tiles.GetLength(1);
        var tileDtos = new List<List<TileInfoDto>>();

        for (int x = 0; x < width; x++)
        {
            var row = new List<TileInfoDto>();
            for (int y = 0; y < height; y++)
            {
                var tile = tiles[x, y];
                row.Add(new TileInfoDto(tile.Type, tile.Bot?.BotId));
            }
            tileDtos.Add(row);
        }

        return tileDtos;
    }
}