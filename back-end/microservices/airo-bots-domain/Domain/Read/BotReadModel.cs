﻿using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_bots_microservice.Domain.Read;

public class BotReadModel : IReadModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Health { get; set; }
    public int Attack { get; set; }
    public int Defense { get; set; }

    public override string? ToString()
    {
        return $"Id: {Id}, Name: {Name}, Price {Price}, Health {Health}, Attack {Attack}, Defense {Defense}";
    }
}