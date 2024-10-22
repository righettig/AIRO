using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.Simulation.Actions;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System.Runtime.Loader;

namespace airo_event_simulation_engine.Impl;

// TODO this can be used to validate scripts either exposing API or doing at simulation start
// this depends only on simulation.domain
// Move to "domain" or inside dedicated project then expose an API for validation
public class CSharpBehaviourCompiler : IBehaviourCompiler
{
    public async Task<IBotAgent> Compile(string behaviorScript, CancellationToken token)
    {
        var scriptOptions = ScriptOptions.Default
            .AddReferences(typeof(Bot).Assembly)
            .AddReferences(typeof(Console).Assembly)
            .AddImports("System")
            .AddImports("System.Collections.Generic")
            .AddImports(typeof(HoldAction).Namespace)
            .AddImports(typeof(IBotState).Namespace)
            .AddImports(typeof(BaseBotAgent).Namespace);

        var compilationTask = Task.Run(async () =>
        {
            // Run the script
            var scriptState = await CSharpScript.RunAsync(
                behaviorScript,
                options: scriptOptions,
                cancellationToken: token
            );

            // Get the compiled assembly from the ScriptState
            var compilation = scriptState.Script.GetCompilation();

            using var peStream = new MemoryStream();

            var emitResult = compilation.Emit(peStream, cancellationToken: token);

            if (!emitResult.Success)
            {
                throw new InvalidOperationException("Script compilation failed.");
            }

            peStream.Seek(0, SeekOrigin.Begin);
            var assembly = AssemblyLoadContext.Default.LoadFromStream(peStream);

            return assembly;
        }, token);

        // Create a delay task for timeout
        var timeoutTask = Task.Delay(TimeSpan.FromSeconds(5), token);

        // Wait for either the compilation to finish or the timeout
        var completedTask = await Task.WhenAny(compilationTask, timeoutTask);

        if (completedTask == timeoutTask)
        {
            // Cancel the compilation task
            token.ThrowIfCancellationRequested(); // This throws an OperationCanceledException
            throw new TimeoutException("Behavior compilation timed out.");
        }

        var assembly = await compilationTask;

        // Now you can access types from the loaded assembly
        var agentType = assembly.GetTypes()
            .FirstOrDefault(t => typeof(BaseBotAgent).IsAssignableFrom(t) || typeof(IBotAgent).IsAssignableFrom(t));

        if (agentType == null)
        {
            throw new InvalidOperationException("No implementation of BaseBotAgent found in the script.");
        }

        // Ensure the class has a parameterless constructor
        var constructor = agentType.GetConstructor(Type.EmptyTypes);
        if (constructor == null)
        {
            throw new InvalidOperationException("The class must have a parameterless constructor.");
        }

        // Instantiate the agent
        var botAgent = (IBotAgent)Activator.CreateInstance(agentType);

        return botAgent;
    }
}
