using airo_cqrs_eventsourcing_lib.Core;

namespace airo_bots_microservice.Domain.Read.Queries;

public class GetBotById(Guid BotId) : IQuery<IEnumerable<BotReadModel>>
{
    public Guid BotId { get; } = BotId;
}