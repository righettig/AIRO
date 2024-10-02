using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_purchase_microservice.Domain.Read;

public class PurchaseReadRepository : IReadRepository<PurchaseReadModel>
{
    private readonly List<PurchaseReadModel> entities = [];

    public IQueryable<PurchaseReadModel> Entities => entities.AsQueryable();

    public void Add(PurchaseReadModel model)
    {
        entities.Add(model);
    }

    public PurchaseReadModel GetById(Guid id)
    {
        return entities.FirstOrDefault(x => x.UserId == id);
    }

    public void Update(PurchaseReadModel model)
    {
        var index = entities.FindIndex(x => x.UserId == model.UserId);
        entities[index] = model;
    }

    public void Remove(Guid id)
    {
        var index = entities.FindIndex(x => x.UserId == id);
        entities.RemoveAt(index);
    }

    public void SaveChanges()
    {
        Console.WriteLine("Saving changes");
    }

    public void DumpData()
    {
        entities.ToList().ForEach(Console.WriteLine);
    }
}