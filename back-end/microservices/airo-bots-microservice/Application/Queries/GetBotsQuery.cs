using airo_bots_microservice.Domain;
using MediatR;

namespace airo_bots_microservice.Application.Queries;

public class GetBotsQuery : IRequest<IEnumerable<Bot>> { }
