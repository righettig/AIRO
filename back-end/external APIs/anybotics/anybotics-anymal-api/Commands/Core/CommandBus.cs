using anybotics_anymal_api.Commands.Repository;
using AnymalGrpc;

namespace anybotics_anymal_api.Commands.Core;

public class CommandBus(IServiceProvider serviceProvider, ICommandRepository commandRepository) : ICommandBus
{
    public async Task<UpdateResponse> SendAsync<TCommand>(TCommand command) where TCommand : ICommand
    {
        await commandRepository.SaveCommandAsync(command);

        var handler = serviceProvider.GetService<ICommandHandler<TCommand>>();

        if (handler != null)
        {
            return await handler.HandleAsync(command);
        }
        else
        {
            throw new InvalidOperationException($"No handler registered for {typeof(TCommand).Name}");
        }
    }
}
