using airo_bot_behaviour_compiler_microservice.DTOs;
using airo_bot_behaviour_compiler_microservice.Impl;
using airo_bot_behaviour_compiler_microservice.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace airo_bot_behaviour_compiler_microservice.Controllers;

[ApiController]
[Route("api/bot-behaviors")]
public class BotBehaviourCompilerController : ControllerBase
{
    private readonly ILogger<BotBehaviourCompilerController> _logger;

    private readonly IBehaviourCompiler _behaviourCompiler;
    private readonly IBotBehaviorStorageService _storageService;
    private readonly IRabbitMQPublisherService _publisherService;

    public BotBehaviourCompilerController(ILogger<BotBehaviourCompilerController> logger,
                                          IBehaviourCompiler behaviourCompiler,
                                          IBotBehaviorStorageService storageService,
                                          IRabbitMQPublisherService publisherService)
    {
        _logger = logger;
        _behaviourCompiler = behaviourCompiler;
        _storageService = storageService;
        _publisherService = publisherService;
    }

    [HttpPost("{botBehaviourId}/validate")]
    public async Task<IActionResult> Validate([FromBody] ValidateBotBehaviourRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.BotBehaviourScript))
        {
            return BadRequest("Script code cannot be empty.");
        }

        var validationResult = await _behaviourCompiler.ValidateScriptAsync(request.BotBehaviourScript, cancellationToken);

        return Ok(validationResult);
    }

    [HttpPost("{botBehaviourId}/compile")]
    public async Task<IActionResult> Compile([FromBody] CompileBotBehaviourRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.BotBehaviourScript))
        {
            return BadRequest(new CompileResponse("Script code cannot be empty."));
        }

        // Step 1: Compile
        var compileResult = await _behaviourCompiler.CompileScriptAsync(request.BotBehaviourScript, cancellationToken);

        if (!compileResult.Success)
        {
            return BadRequest(new CompileResponse("Compilation failed.", compileResult.Errors));
        }

        // Step 2: Save to Blob Storage
        var blobUri = await _storageService.SaveCompiledBehaviorAsync(request.BotBehaviourId, compileResult.CompiledAssembly);

        // Step 3: Publish update message
        var updateMessage = new BotBehaviorUpdateMessage
        {
            BehaviorId = request.BotBehaviourId,
            BlobUri = blobUri,
            Timestamp = DateTime.UtcNow
        };

        _publisherService.PublishBotBehaviorUpdate(updateMessage);

        return Ok(new CompileResponse("Script compiled and saved successfully.", null, blobUri));
    }
}
