using airo_cqrs_eventsourcing_lib.Core;

namespace airo_purchase_microservice.Domain.Read.Queries;

public class GetPurchasedBotsByUserId(Guid UserId) : IQuery<Guid[]>
{
    public Guid UserId { get; } = UserId;
}
