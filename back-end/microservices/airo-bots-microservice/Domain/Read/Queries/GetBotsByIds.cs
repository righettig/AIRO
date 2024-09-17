using airo_cqrs_eventsourcing_lib.Core;

namespace airo_bots_microservice.Domain.Read.Queries;

public class GetBotsByIds(Guid[] botIds) : IQuery<BotReadModel[]?>
{
    public Guid[] BotIds { get; } = botIds;
}
