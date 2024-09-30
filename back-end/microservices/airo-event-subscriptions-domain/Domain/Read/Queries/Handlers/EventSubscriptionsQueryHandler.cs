using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using MediatR;

namespace airo_event_subscriptions_domain.Domain.Read.Queries.Handlers;

public class EventSubscriptionsQueryHandler(IReadRepository<EventSubscriptionReadModel> readRepository) :
    IRequestHandler<GetEventParticipants, Guid[]>
{
    private readonly IReadRepository<EventSubscriptionReadModel> readRepository = readRepository;

    public Task<Guid[]> Handle(GetEventParticipants query, CancellationToken cancellationToken)
    {
        var @event = readRepository.GetById(query.EventId);
        var participants = @event.Participants.Select(x => x.Item1).ToArray();
        return Task.FromResult(participants);
    }
}