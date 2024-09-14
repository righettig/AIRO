using airo_cqrs_eventsourcing_lib.Core;

namespace airo_bots_microservice.Domain.Write.Commands;

public class CreateBotCommand(Guid id, string name, decimal price) : ICommand
{
    public Guid Id { get; } = id;
    public string Name { get; } = name;
    public decimal Price { get; } = price;
}