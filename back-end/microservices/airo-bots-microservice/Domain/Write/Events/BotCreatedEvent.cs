using airo_cqrs_eventsourcing_lib.Core;

namespace airo_bots_microservice.Domain.Write.Events;

public class BotCreatedEvent(Guid id, string name, decimal price) : IEvent
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public decimal Price { get; } = price;
}
