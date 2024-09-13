using airo_bots_microservice.Domain;

namespace airo_bots_microservice.Application.Handlers.Core;

public abstract class BaseQueryHandler(IBotRepository botRepository)
{
    protected readonly IBotRepository _botRepository = botRepository;
}
