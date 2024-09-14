using airo_cqrs_eventsourcing_lib.Core;
using MediatR;

namespace airo_bots_microservice.Domain.Read.Queries.Handlers;

public class BotQueryHandler(IReadRepository<BotReadModel> readRepository) :
    IRequestHandler<GetBotById, BotReadModel?>,
    IRequestHandler<GetAllBots, IEnumerable<BotReadModel>>
{
    private readonly IReadRepository<BotReadModel> readRepository = readRepository;

    public Task<BotReadModel?> Handle(GetBotById query, CancellationToken cancellationToken)
    {
        var result = readRepository.Entities.FirstOrDefault(x => x.Id <= query.BotId);

        return Task.FromResult(result);
    }

    public Task<IEnumerable<BotReadModel>> Handle(GetAllBots request, CancellationToken cancellationToken)
    {
        var result = readRepository.Entities.AsEnumerable();

        return Task.FromResult(result);
    }
}