using airo_cqrs_eventsourcing_lib.Core.Interfaces;
using MediatR;

namespace airo_cqrs_eventsourcing_lib.Core.Impl;

public abstract class CommandHandlerBase<TCommand, TAggregate> : IRequestHandler<TCommand>
    where TCommand : ICommand
    where TAggregate : IAggregateRoot, new()
{
    private readonly IAggregateRepository<TAggregate> aggregateRepository;

    public CommandHandlerBase(IAggregateRepository<TAggregate> aggregateRepository)
    {
        this.aggregateRepository = aggregateRepository;
    }

    public async Task Handle(TCommand command, CancellationToken cancellationToken)
    {
        Guid aggregateId = GetAggregateId(command);

        var aggregate = await aggregateRepository.GetById(aggregateId);

        ProcessCommand(command, aggregate);

        aggregateRepository.Save(aggregate);
    }

    /// <summary>
    /// Allows concrete command handlers to specify custom Guid keys
    /// </summary>
    protected abstract Guid GetAggregateId(TCommand command);

    protected abstract void ProcessCommand(TCommand command, TAggregate aggregate);
}