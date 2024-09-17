using airo_cqrs_eventsourcing_lib.Core;
using MediatR;

namespace airo_bots_microservice.Domain.Read.Queries.Handlers;

public class BotQueryHandler(IReadRepository<BotReadModel> readRepository) :
    IRequestHandler<GetAllBots, BotReadModel[]>,
    IRequestHandler<GetBotsByIds, BotReadModel[]?>
{
    private readonly IReadRepository<BotReadModel> readRepository = readRepository;

    public Task<BotReadModel[]> Handle(GetAllBots query, CancellationToken cancellationToken)
    {
        var result = readRepository.Entities.ToArray();

        return Task.FromResult(result);
    }

    public Task<BotReadModel[]?> Handle(GetBotsByIds query, CancellationToken cancellationToken)
    {
        var result = readRepository.Entities.Where(x => query.BotIds.Contains(x.Id)).ToArray();

        return Task.FromResult(result);
    }
}