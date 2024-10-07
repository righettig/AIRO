using airo_event_simulation_domain;
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

        await CSharpScript.EvaluateAsync(
            behaviorScript,
            globals: new SimulationState(),
            options: scriptOptions,
            cancellationToken: token);
    }
}
