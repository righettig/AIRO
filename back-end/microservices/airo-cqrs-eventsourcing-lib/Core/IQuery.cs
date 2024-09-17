using MediatR;

namespace airo_cqrs_eventsourcing_lib.Core;

public interface IQuery<TResponse> : IRequest<TResponse>
{
}