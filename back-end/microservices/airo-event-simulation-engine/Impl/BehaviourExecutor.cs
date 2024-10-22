using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;

namespace airo_event_simulation_engine.Impl;

public class BehaviourExecutor(IBehaviourCompiler compiler) : IBehaviourExecutor
{
    // Dictionary to store bot agents with IBotState.Id as the key
    private readonly Dictionary<Guid, IBotAgent> _botAgents = [];

    public async Task<ISimulationAction> Execute(string behaviorScript, IBotState state, CancellationToken token)
    {
        if (_botAgents.TryGetValue(state.Id, out var botAgent))
        {
            // If the bot agent is already in the dictionary, execute its next move
            return await RunBehaviour(botAgent, state, token);
        }

        botAgent = await compiler.Compile(behaviorScript, token);

        // Store the agent in the dictionary
        _botAgents[state.Id] = botAgent;

        Console.WriteLine($"Compiled script {state.Id}");

        // Execute the bot agent's action
        return await RunBehaviour(botAgent, state, token);
    }

    private static async Task<ISimulationAction> RunBehaviour(IBotAgent botAgent, IBotState state, CancellationToken token) 
    {
        // Create the execution task
        var executionTask = Task.Run(() =>
        {
            var simulationAction = botAgent.ComputeNextMove(state);
            return simulationAction;
        }, token);

        // Create a delay task for timeout
        var timeoutTask = Task.Delay(TimeSpan.FromSeconds(5), token);

        // Wait for either the execution to finish or the timeout
        var completedTask = await Task.WhenAny(executionTask, timeoutTask);

        if (completedTask == timeoutTask)
        {
            // Cancel the execution task
            token.ThrowIfCancellationRequested(); // This throws an OperationCanceledException
            throw new TimeoutException("Behavior execution timed out.");
        }

        // Await the execution task to propagate any exceptions
        return await executionTask;
    }
}
