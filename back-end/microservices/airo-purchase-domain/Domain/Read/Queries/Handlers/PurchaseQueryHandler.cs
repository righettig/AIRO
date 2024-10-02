using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using MediatR;

namespace airo_purchase_microservice.Domain.Read.Queries.Handlers;

public class PurchaseQueryHandler(IReadRepository<PurchaseReadModel> readRepository) :
    IRequestHandler<GetPurchasedBotsByUserId, Guid[]>
{
    private readonly IReadRepository<PurchaseReadModel> readRepository = readRepository;

    public Task<Guid[]> Handle(GetPurchasedBotsByUserId query, CancellationToken cancellationToken)
    {
        var result = readRepository.Entities
            .Where(x => x.UserId == query.UserId)
            .Select(x => x.BotId)
            .ToArray();

        return Task.FromResult(result);
    }
}