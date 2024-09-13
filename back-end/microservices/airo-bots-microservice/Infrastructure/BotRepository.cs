using airo_bots_microservice.Domain;

namespace airo_bots_microservice.Infrastructure;

public class BotRepository : IBotRepository
{
    private readonly List<Bot> _bots = [];

    public async Task AddAsync(Bot bot)
    {
        _bots.Add(bot);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var bot = _bots.FirstOrDefault(b => b.Id == id);
        if (bot != null)
        {
            _bots.Remove(bot);
        }
        await Task.CompletedTask;
    }

    public async Task<IEnumerable<Bot>> GetAllAsync()
    {
        return await Task.FromResult(_bots);
    }

    public async Task<Bot> GetAsync(Guid id)
    {
        return await Task.FromResult(_bots.FirstOrDefault(x => x.Id == id));
    }
}