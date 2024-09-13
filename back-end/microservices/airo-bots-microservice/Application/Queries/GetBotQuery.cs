using airo_bots_microservice.Domain;
using MediatR;

namespace airo_bots_microservice.Application.Queries;

public class GetBotQuery(Guid id) : IRequest<Bot>
{
    public Guid Id { get; } = id;
}
