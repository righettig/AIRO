namespace airo_bot_behaviour_compiler_microservice.DTOs;

public record CompileResponse(string Message, string[]? Errors = null, string? BlobUri = null);
