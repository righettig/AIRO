using airo_cqrs_eventsourcing_lib.Core;

namespace airo_events_microservice.Domain.Read;

public class EventReadRepository : IReadRepository<EventReadModel>
{
    private readonly List<EventReadModel> events = [];

    public IQueryable<EventReadModel> Entities => events.AsQueryable();

    public void Add(EventReadModel model)
    {
        events.Add(model);
    }

    public EventReadModel GetById(Guid id)
    {
        return events.FirstOrDefault(x => x.Id == id);
    }

    public void Update(EventReadModel model)
    {
        var index = events.FindIndex(x => x.Id == model.Id);
        events[index] = model;
    }

    public void Remove(Guid id)
    {
        var index = events.FindIndex(x => x.Id == id);
        events.RemoveAt(index);
    }

    public void SaveChanges()
    {
        Console.WriteLine("Saving changes");
    }

    public void DumpData()
    {
        events.ToList().ForEach(Console.WriteLine);
    }
}