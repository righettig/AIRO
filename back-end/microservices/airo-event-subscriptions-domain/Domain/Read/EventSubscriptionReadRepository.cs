using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_event_subscriptions_domain.Domain.Read;

public class EventSubscriptionReadRepository : IReadRepository<EventSubscriptionReadModel>
{
    private readonly List<EventSubscriptionReadModel> subscriptions = [];

    public IQueryable<EventSubscriptionReadModel> Entities => subscriptions.AsQueryable();

    public void Add(EventSubscriptionReadModel model)
    {
        subscriptions.Add(model);
    }

    public EventSubscriptionReadModel GetById(Guid eventId)
    {
        return subscriptions.FirstOrDefault(x => x.EventId == eventId);
    }

    public void Update(EventSubscriptionReadModel model)
    {
        var index = subscriptions.FindIndex(x => x.EventId == model.EventId);
        subscriptions[index] = model;
    }

    public void Remove(Guid eventId)
    {
        var index = subscriptions.FindIndex(x => x.EventId == eventId);
        subscriptions.RemoveAt(index);
    }

    public void SaveChanges()
    {
        Console.WriteLine("Saving changes");
    }

    public void DumpData()
    {
        subscriptions.ToList().ForEach(Console.WriteLine);
    }
}