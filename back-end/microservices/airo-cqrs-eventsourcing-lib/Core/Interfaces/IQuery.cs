using MediatR;

namespace airo_cqrs_eventsourcing_lib.Core.Interfaces;

public interface IQuery<TResponse> : IRequest<TResponse>
{
}