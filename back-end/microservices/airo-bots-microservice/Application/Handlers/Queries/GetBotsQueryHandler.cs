using airo_bots_microservice.Application.Handlers.Core;
using airo_bots_microservice.Application.Queries;
using airo_bots_microservice.Domain;

using MediatR;

namespace airo_bots_microservice.Application.Handlers.Queries;

public class GetBotsQueryHandler(IBotRepository botRepository) : 
    BaseQueryHandler(botRepository), 
    IRequestHandler<GetBotsQuery, IEnumerable<Bot>>
{
    public async Task<IEnumerable<Bot>> Handle(GetBotsQuery request, CancellationToken cancellationToken)
    {
        return await _botRepository.GetAllAsync();
    }
}
