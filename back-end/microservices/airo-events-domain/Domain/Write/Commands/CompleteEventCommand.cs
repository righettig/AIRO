using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_events_microservice.Domain.Write.Commands;

public class CompleteEventCommand(Guid id, string winnerUserId) : ICommand
{
    public Guid Id { get; } = id;
    public string WinnerUserId { get; set; } = winnerUserId;
}