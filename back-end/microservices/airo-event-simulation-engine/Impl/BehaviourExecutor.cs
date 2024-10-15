using airo_event_simulation_domain.Impl;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_engine.Interfaces;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;

namespace airo_event_simulation_engine.Impl;

public class BehaviourExecutor : IBehaviourExecutor
{
    public async Task Execute(string behaviorScript, CancellationToken token)
    {
        var scriptOptions = ScriptOptions.Default
            .AddReferences(typeof(Bot).Assembly)
            .AddReferences(typeof(Console).Assembly)
            .AddImports("System");

        // Create the execution task
        var executionTask = Task.Run(async () =>
        {
            await CSharpScript.EvaluateAsync(
                behaviorScript,
                globals: new SimulationState(),
                options: scriptOptions,
                cancellationToken: token);
        });

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
        await executionTask;
    }
}

