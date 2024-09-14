using airo_cqrs_eventsourcing_lib.Core;
using MediatR;

namespace airo_bots_microservice.Domain.Read.Queries.Handlers;

public class BotQueryHandler(IReadRepository<BotReadModel> readRepository) :
    IRequestHandler<GetBotById, IEnumerable<BotReadModel>>
{
    private readonly IReadRepository<BotReadModel> readRepository = readRepository;

    public Task<IEnumerable<BotReadModel>> Handle(GetBotById query, CancellationToken cancellationToken)
    {
        var result = readRepository.Entities.Where(x => x.Id <= query.BotId);

        return Task.FromResult(result.AsEnumerable());
    }
}