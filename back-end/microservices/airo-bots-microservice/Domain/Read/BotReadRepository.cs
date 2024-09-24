using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_bots_microservice.Domain.Read;

public class BotReadRepository : IReadRepository<BotReadModel>
{
    private readonly List<BotReadModel> bots = [];

    public IQueryable<BotReadModel> Entities => bots.AsQueryable();

    public void Add(BotReadModel model)
    {
        bots.Add(model);
    }

    public BotReadModel GetById(Guid id)
    {
        return bots.FirstOrDefault(x => x.Id == id);
    }

    public void Update(BotReadModel model)
    {
        var index = bots.FindIndex(x => x.Id == model.Id);
        bots[index] = model;
    }

    public void Remove(Guid id)
    {
        var index = bots.FindIndex(x => x.Id == id);
        bots.RemoveAt(index);
    }

    public void SaveChanges()
    {
        Console.WriteLine("Saving changes");
    }

    public void DumpData()
    {
        bots.ToList().ForEach(Console.WriteLine);
    }
}