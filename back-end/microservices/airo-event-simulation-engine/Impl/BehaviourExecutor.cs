using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.Simulation.Actions;
using airo_event_simulation_domain.Interfaces;
using airo_event_simulation_engine.Interfaces;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Newtonsoft.Json.Linq;
using System.Runtime.Loader;

namespace airo_event_simulation_engine.Impl;

// TODO this can be used to validate scripts either exposing API or doing at simulation start
// this depends only on simulation.domain. Move to "domain" or inside dedicated project then expose an API for validation
static class BehaviourCompiler 
{
    public static async Task<IBotAgent> Compile(string behaviorScript, CancellationToken token) 
    {
        var scriptOptions = ScriptOptions.Default
            .AddReferences(typeof(Bot).Assembly)
            .AddReferences(typeof(Console).Assembly)
            .AddImports("System")
            .AddImports("System.Collections.Generic")
            .AddImports(typeof(HoldAction).Namespace)
            .AddImports(typeof(IBotState).Namespace)
            .AddImports(typeof(BaseBotAgent).Namespace);

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

public class BehaviourExecutor : IBehaviourExecutor
{
    // Dictionary to store bot agents with IBotState.Id as the key
    private readonly Dictionary<Guid, IBotAgent> _botAgents = [];

    public async Task<ISimulationAction> Execute(string behaviorScript, IBotState state, CancellationToken token)
    {
        if (_botAgents.TryGetValue(state.Id, out var botAgent))
        {
            // If the bot agent is already in the dictionary, execute its next move
            return botAgent.ComputeNextMove(state);
        }

        botAgent = await BehaviourCompiler.Compile(behaviorScript, token);

        // Store the agent in the dictionary
        _botAgents[state.Id] = botAgent;

        Console.WriteLine($"Compiled script {state.Id}");

        // Execute the bot agent's action
        return botAgent.ComputeNextMove(state);
    }
}
