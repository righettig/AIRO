using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;

namespace airo_event_simulation_engine.Impl;

public class BehaviourExecutor : IBehaviourExecutor
{
    public async Task<ISimulationAction> Execute(IBotAgent botAgent, IBotState state, CancellationToken token)
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
