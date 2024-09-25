using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_bots_microservice.Domain.Write.Commands;

public class DeleteBotCommand(Guid id) : ICommand
{
    public Guid Id { get; } = id;
}