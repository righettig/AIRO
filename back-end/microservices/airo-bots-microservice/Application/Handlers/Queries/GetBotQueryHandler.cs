using airo_bots_microservice.Application.Handlers.Core;
using airo_bots_microservice.Application.Queries;
using airo_bots_microservice.Domain;
using MediatR;

namespace airo_bots_microservice.Application.Handlers.Queries;

public class GetBotQueryHandler(IBotRepository botRepository) : 
    BaseQueryHandler(botRepository), 
    IRequestHandler<GetBotQuery, Bot>
{
    public async Task<Bot> Handle(GetBotQuery request, CancellationToken cancellationToken)
    {
        return await _botRepository.GetAsync(request.Id);
    }
}
