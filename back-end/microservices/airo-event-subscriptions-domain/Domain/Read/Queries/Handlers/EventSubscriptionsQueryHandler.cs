using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using MediatR;

namespace airo_event_subscriptions_domain.Domain.Read.Queries.Handlers;

public class EventSubscriptionsQueryHandler(IReadRepository<EventSubscriptionReadModel> readRepository) :
    IRequestHandler<GetEventParticipants, string[]>,
    IRequestHandler<GetEventParticipantsFullDetails, EventSubscriptionDto[]>,
    IRequestHandler<GetSubscribedEventsByUserId, Guid[]>
{
    private readonly IReadRepository<EventSubscriptionReadModel> readRepository = readRepository;

    public Task<string[]> Handle(GetEventParticipants query, CancellationToken cancellationToken)
    {
        var eventSubscription = readRepository.GetById(query.EventId);

        if (eventSubscription is null) return Task.FromResult<string[]>([]);

        var participants = eventSubscription.Participants.Select(x => x.Item1).ToArray();
        return Task.FromResult(participants);
    }
    
    public Task<EventSubscriptionDto[]> Handle(GetEventParticipantsFullDetails query, CancellationToken cancellationToken)
    {
        var eventSubscription = readRepository.GetById(query.EventId);

        if (eventSubscription is null) return Task.FromResult<EventSubscriptionDto[]>([]);

        var result = eventSubscription.Participants.Select(x => new EventSubscriptionDto
        {
            UserId = x.Item1,
            BotId = x.Item2.BotId,
            BotBehaviourId = x.Item2.BotBehaviourId,
        }).ToArray();

        return Task.FromResult(result);
    }

    public Task<Guid[]> Handle(GetSubscribedEventsByUserId query, CancellationToken cancellationToken)
    {
        var containsUser = 
            (EventSubscriptionReadModel @event, string userId) => 
                @event.Participants.Any(participant => participant.Item1 == userId);

        var subscribedEvents = readRepository.Entities
            .Where(x => containsUser(x, query.UserId))
            .Select(x => x.EventId)
            .ToArray();

        return Task.FromResult(subscribedEvents);
    }
}