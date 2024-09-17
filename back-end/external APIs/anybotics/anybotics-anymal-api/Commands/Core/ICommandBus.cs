using AnymalGrpc;

namespace anybotics_anymal_api.Commands.Core;

public interface ICommandBus
{
    Task<UpdateResponse> SendAsync<TCommand>(TCommand command) where TCommand : ICommand;
}
