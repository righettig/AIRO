﻿using airo_bots_microservice.Domain.Write.Events;
using airo_cqrs_eventsourcing_lib.Core.Impl;
using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_bots_microservice.Domain.Aggregates;

public class BotAggregate : AggregateRoot, IAggregateRoot
{
    public void CreateBot(Guid id, string name, decimal price, int health, int attack, int defense)
    {
        RaiseEvent(new BotCreatedEvent(id, name, price, health, attack, defense));
    }

    public void DeleteBot(Guid id)
    {
        RaiseEvent(new BotDeletedEvent(id));
    }

    public void UpdateBot(Guid id, string name, decimal price, int health, int attack, int defense)
    {
        RaiseEvent(new BotUpdatedEvent(id, name, price, health, attack, defense));
    }

    private void Apply(BotCreatedEvent @event)
    {
    }

    private void Apply(BotUpdatedEvent @event)
    {
    }

    private void Apply(BotDeletedEvent @event)
    {
    }
}
