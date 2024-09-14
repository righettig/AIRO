using airo_cqrs_eventsourcing_lib.Core;

namespace airo_bots_microservice.Domain.Write.Events;

public class BotDeletedEvent(Guid id) : IEvent
{
    public Guid Id { get; } = id;
}
