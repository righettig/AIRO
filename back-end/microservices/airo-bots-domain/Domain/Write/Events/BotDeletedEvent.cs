using airo_cqrs_eventsourcing_lib.Core.Impl;

namespace airo_bots_microservice.Domain.Write.Events;

public class BotDeletedEvent(Guid id) : Event
{
    public Guid Id { get; } = id;
}
