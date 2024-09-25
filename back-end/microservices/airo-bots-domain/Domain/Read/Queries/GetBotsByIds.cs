using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_bots_microservice.Domain.Read.Queries;

public class GetBotsByIds(Guid[] botIds) : IQuery<BotReadModel[]?>
{
    public Guid[] BotIds { get; } = botIds;
}
