using airo_bots_microservice.Domain.Write.Events;
using airo_cqrs_eventsourcing_lib.Core;
using airo_cqrs_eventsourcing_lib.Impl;

namespace airo_bots_microservice.Domain.Aggregates;

public class BotAggregate : AggregateRoot, IAggregateRoot
{
    public string Name { get; private set; }
    public decimal Price { get; private set; }

    public void CreateProduct(Guid id, string name, decimal price)
    {
        RaiseEvent(new BotCreatedEvent(id, name, price));
    }

    private void Apply(BotCreatedEvent @event)
    {
        Name = @event.Name;
        Price = @event.Price;
    }
}
