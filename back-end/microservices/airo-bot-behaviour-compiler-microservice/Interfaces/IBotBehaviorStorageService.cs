namespace airo_bot_behaviour_compiler_microservice.Interfaces;

public interface IBotBehaviorStorageService
{
    Task<string> SaveCompiledBehaviorAsync(string behaviorId, byte[] compiledAssembly);
}
