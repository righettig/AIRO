using MediatR;

namespace airo_cqrs_eventsourcing_lib.Core;

public interface ICommand : IRequest
{
    public Guid Id { get; }
}
