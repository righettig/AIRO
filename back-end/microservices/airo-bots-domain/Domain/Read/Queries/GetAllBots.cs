using airo_cqrs_eventsourcing_lib.Core.Interfaces;

namespace airo_bots_microservice.Domain.Read.Queries;

public class GetAllBots() : IQuery<BotReadModel[]>
{
}