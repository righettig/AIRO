namespace airo_bot_behaviour_compiler_microservice.Interfaces;

public class CompileResult
{
    public bool Success { get; set; }
    public string[] Errors { get; set; } = [];
    public byte[]? CompiledAssembly { get; set; }
}

public class ValidationResult
{
    public bool Success { get; set; }
    public string[] Errors { get; set; } = [];
}

public interface IBehaviourCompiler
{
    Task<ValidationResult> ValidateScriptAsync(string code, CancellationToken token);
    Task<CompileResult> CompileScriptAsync(string code, CancellationToken token);
}