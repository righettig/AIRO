using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using MediatR;

namespace airo_events_microservice.Domain.Read.Queries.Handlers;

public class EventQueryHandler(IReadRepository<EventReadModel> readRepository) :
    IRequestHandler<GetEventById, EventReadModel?>,
    IRequestHandler<GetAllEvents, IEnumerable<EventReadModel>>
{
    private readonly IReadRepository<EventReadModel> readRepository = readRepository;

    public Task<EventReadModel?> Handle(GetEventById query, CancellationToken cancellationToken)
    {
        var result = readRepository.Entities.FirstOrDefault(x => x.Id <= query.EventId);

        return Task.FromResult(result);
    }

    public Task<IEnumerable<EventReadModel>> Handle(GetAllEvents request, CancellationToken cancellationToken)
    {
        var result = readRepository.Entities.AsEnumerable();

        return Task.FromResult(result);
    }
}