using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using MediatR;

namespace airo_event_subscriptions_domain.Domain.Read.Queries.Handlers;

public class EventSubscriptionsQueryHandler(IReadRepository<EventSubscriptionReadModel> readRepository) :
    IRequestHandler<GetEventParticipants, string[]>
{
    private readonly IReadRepository<EventSubscriptionReadModel> readRepository = readRepository;

    public Task<string[]> Handle(GetEventParticipants query, CancellationToken cancellationToken)
    {
        var eventSubscription = readRepository.GetById(query.EventId);

        if (eventSubscription is null) return Task.FromResult<string[]>([]);

        var participants = eventSubscription.Participants.Select(x => x.Item1).ToArray();
        return Task.FromResult(participants);
    }
}