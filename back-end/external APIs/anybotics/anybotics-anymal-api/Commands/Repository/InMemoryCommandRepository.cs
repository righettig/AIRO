namespace anybotics_anymal_api.Commands.Repository;

using System.Collections.Concurrent;
using anybotics_anymal_api.Commands.Core;

public class InMemoryCommandRepository : ICommandRepository
{
    // ConcurrentDictionary to store commands by agentId
    private readonly ConcurrentDictionary<string, List<ICommand>> _commandsByAgentId = new();

    public Task SaveCommandAsync<TCommand>(TCommand command) where TCommand : ICommand
    {
        var agentId = command.AgentId;

        // Ensure there's a list of commands for the given agentId
        var commands = _commandsByAgentId.GetOrAdd(agentId, []);

        // Add the command to the list
        commands.Add(command);

        return Task.CompletedTask;
    }

    public Task<IEnumerable<ICommand>> GetCommandsByAgentIdAsync(string agentId)
    {
        // Retrieve commands for the given agentId
        _commandsByAgentId.TryGetValue(agentId, out var commands);

        // Return the commands or an empty list if none exist
        return Task.FromResult(commands?.AsEnumerable() ?? []);
    }
}
