using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_bots_microservice.Domain.Write.Events;

public class BotUpdatedEvent(Guid id, string name, decimal price, int health, int attack, int defense) : Event
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public decimal Price { get; } = price;
    public int Health { get; } = health;
    public int Attack { get; } = attack;
    public int Defense { get; } = defense;
}
