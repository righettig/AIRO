using airo_bots_microservice.Domain.Write.Events;
using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;
using System.Xml.Linq;

namespace airo_bots_microservice.Domain.Aggregates;

public class BotAggregate : AggregateRoot, IAggregateRoot
{
    public string Name { get; private set; }
    public decimal Price { get; private set; }

    public void CreateBot(Guid id, string name, decimal price)
    {
        RaiseEvent(new BotCreatedEvent(id, name, price));
    }

    public void DeleteBot(Guid id)
    {
        RaiseEvent(new BotDeletedEvent(id));
    }

    private void Apply(BotCreatedEvent @event)
    {
        Name = @event.Name;
        Price = @event.Price;
    }

    private void Apply(BotDeletedEvent @event)
    {
    }
}
