using AnymalGrpc;

namespace anybotics_anymal_api.Commands.Core;

internal interface ICommandHandler<TCommand> where TCommand : ICommand
{
    Task<UpdateResponse> HandleAsync(TCommand command);
}