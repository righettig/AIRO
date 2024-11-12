using airo_bot_behaviour_compiler_microservice.Interfaces;
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Impl.Simulation.Actions;
using airo_event_simulation_domain.Interfaces;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System.Reflection;

namespace airo_bot_behaviour_compiler_microservice.Impl
{
    public class CSharpBehaviourCompiler : IBehaviourCompiler
    {
        private const int CompilationTimeoutSeconds = 5;

        public async Task<CompileResult> CompileScriptAsync(string behaviorScript, CancellationToken token)
        {
            var scriptOptions = GetScriptOptions();

            // Compile the script asynchronously
            var assemblyBytes = await CompileScriptToAssemblyAsync(behaviorScript, scriptOptions, token);

            // Load assembly and check for a valid bot agent
            return ValidateAgentInAssembly(assemblyBytes);
        }

        public async Task<ValidationResult> ValidateScriptAsync(string code, CancellationToken token)
        {
            try
            {
                var scriptOptions = GetScriptOptions();

                // Compile script to diagnostics
                var script = CSharpScript.Create(code, scriptOptions);
                var diagnostics = script.Compile(token);

                // Return if there are errors in diagnostics
                if (diagnostics.Any(d => d.Severity == DiagnosticSeverity.Error))
                {
                    return CreateValidationResult(diagnostics, success: false);
                }

                // Compile to assembly to check for agent type and constructor
                var assemblyBytes = await CompileScriptToAssemblyAsync(code, scriptOptions, token);
                var validationResult = ValidateAgentInAssembly(assemblyBytes);

                return new ValidationResult
                {
                    Success = validationResult.Success,
                    Errors = validationResult.Errors
                };
            }
            catch (Exception ex)
            {
                return new ValidationResult
                {
                    Success = false,
                    Errors = [$"Validation failed: {ex.Message}"]
                };
            }
        }

        private static async Task<byte[]> CompileScriptToAssemblyAsync(string scriptCode, ScriptOptions scriptOptions, CancellationToken token)
        {
            var compilationTask = Task.Run(async () =>
            {
                var scriptState = await CSharpScript.RunAsync(scriptCode, options: scriptOptions, cancellationToken: token);
                var compilation = scriptState.Script.GetCompilation();

                using var peStream = new MemoryStream();
                var emitResult = compilation.Emit(peStream, cancellationToken: token);

                if (!emitResult.Success)
                    throw new InvalidOperationException("Script compilation failed.");

                return peStream.ToArray();
            }, token);

            var timeoutTask = Task.Delay(TimeSpan.FromSeconds(CompilationTimeoutSeconds), token);
            var completedTask = await Task.WhenAny(compilationTask, timeoutTask);

            if (completedTask == timeoutTask)
                throw new TimeoutException("Behavior compilation timed out.");

            return await compilationTask;
        }

        private static CompileResult ValidateAgentInAssembly(byte[] assemblyBytes)
        {
            var assembly = Assembly.Load(assemblyBytes);
            var agentType = assembly.GetTypes()
                .FirstOrDefault(t => typeof(BaseBotAgent).IsAssignableFrom(t) || typeof(IBotAgent).IsAssignableFrom(t));

            if (agentType == null)
            {
                return new CompileResult
                {
                    Success = false,
                    Errors = ["No implementation of BaseBotAgent or IBotAgent found in the script."]
                };
            }

            if (agentType.GetConstructor(Type.EmptyTypes) == null)
            {
                return new CompileResult
                {
                    Success = false,
                    Errors = ["The class must have a parameterless constructor."]
                };
            }

            return new CompileResult { Success = true, CompiledAssembly = assemblyBytes };
        }

        private static ValidationResult CreateValidationResult(IEnumerable<Diagnostic> diagnostics, bool success)
        {
            return new ValidationResult
            {
                Success = success,
                Errors = diagnostics
                    .Where(d => d.Severity == DiagnosticSeverity.Error)
                    .Select(d => d.ToString())
                    .ToArray()
            };
        }

        private static ScriptOptions GetScriptOptions()
        {
            return ScriptOptions.Default
                .AddReferences(typeof(Bot).Assembly, typeof(Console).Assembly)
                .AddImports("System", "System.Collections.Generic",
                            typeof(HoldAction).Namespace,
                            typeof(IBotState).Namespace,
                            typeof(BaseBotAgent).Namespace);
        }
    }
}
