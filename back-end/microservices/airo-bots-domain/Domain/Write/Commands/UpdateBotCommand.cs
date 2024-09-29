using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_bots_microservice.Domain.Write.Commands;

public class UpdateBotCommand(Guid id, string name, decimal price) : ICommand
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public decimal Price { get; } = price;
}