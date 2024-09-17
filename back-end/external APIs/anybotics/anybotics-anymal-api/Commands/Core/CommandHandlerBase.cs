using AnymalGrpc;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.Core;

public abstract class CommandHandlerBase<TCommand>(AnymalService anymalService) : ICommandHandler<TCommand> where TCommand : ICommand
{
    public abstract Task<UpdateResponse> HandleAsync(TCommand command);
}
