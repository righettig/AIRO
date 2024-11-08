using airo_bot_behaviour_compiler_microservice.Controllers;
using airo_bot_behaviour_compiler_microservice.DTOs;
using airo_bot_behaviour_compiler_microservice.Impl;
using airo_bot_behaviour_compiler_microservice.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace airo_bot_behaviour_compiler_tests;

public class BotBehaviourCompilerControllerTests
{
    private readonly Mock<ILogger<BotBehaviourCompilerController>> _loggerMock;
    private readonly Mock<IBehaviourCompiler> _behaviourCompilerMock;
    private readonly Mock<IBotBehaviorStorageService> _storageServiceMock;
    private readonly Mock<IRabbitMQPublisherService> _publisherServiceMock;

    private readonly BotBehaviourCompilerController _controller;

    public BotBehaviourCompilerControllerTests()
    {
        _loggerMock = new Mock<ILogger<BotBehaviourCompilerController>>();
        _behaviourCompilerMock = new Mock<IBehaviourCompiler>();
        _storageServiceMock = new Mock<IBotBehaviorStorageService>();
        _publisherServiceMock = new Mock<IRabbitMQPublisherService>();

        _controller = new BotBehaviourCompilerController(
            _loggerMock.Object,
            _behaviourCompilerMock.Object,
            _storageServiceMock.Object,
            _publisherServiceMock.Object);
    }

    [Fact]
    public async Task Validate_ShouldReturnBadRequest_WhenScriptIsEmpty()
    {
        // Arrange
        var request = new ValidateBotBehaviourRequest(BotBehaviourId: Guid.NewGuid().ToString(), BotBehaviourScript: string.Empty);

        // Act
        var result = await _controller.Validate(request, CancellationToken.None);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Script code cannot be empty.", badRequestResult.Value);
    }

    [Fact]
    public async Task Validate_ShouldReturnOk_WhenScriptIsValid()
    {
        // Arrange
        var request = new ValidateBotBehaviourRequest(BotBehaviourId: Guid.NewGuid().ToString(), BotBehaviourScript: "valid script");

        var validationResult = new ValidationResult { Success = true };
        _behaviourCompilerMock
            .Setup(b => b.ValidateScriptAsync(request.BotBehaviourScript, It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act
        var result = await _controller.Validate(request, CancellationToken.None);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(validationResult, okResult.Value);
    }

    [Fact]
    public async Task Compile_ShouldReturnBadRequest_WhenScriptIsEmpty()
    {
        // Arrange
        var request = new CompileBotBehaviourRequest(BotBehaviourId: Guid.NewGuid().ToString(), BotBehaviourScript: string.Empty);

        // Act
        var result = await _controller.Compile(request, CancellationToken.None);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        var response = badRequestResult.Value as CompileResponse;

        Assert.NotNull(response);
        Assert.Equal("Script code cannot be empty.", response.Message);
    }

    [Fact]
    public async Task Compile_ShouldReturnBadRequest_WhenCompilationFails()
    {
        // Arrange
        var request = new CompileBotBehaviourRequest(BotBehaviourId: Guid.NewGuid().ToString(), BotBehaviourScript: "invalid script");

        var compileResult = new CompileResult { Success = false, Errors = ["Syntax error"] };
        _behaviourCompilerMock
            .Setup(b => b.CompileScriptAsync(request.BotBehaviourScript, It.IsAny<CancellationToken>()))
            .ReturnsAsync(compileResult);

        // Act
        var result = await _controller.Compile(request, CancellationToken.None);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        var response = badRequestResult.Value as CompileResponse;

        Assert.NotNull(response);
        Assert.Equal("Compilation failed.", response.Message);
        Assert.Equal(compileResult.Errors, response.Errors);
    }

    [Fact]
    public async Task Compile_ShouldReturnOk_WhenCompilationSucceeds()
    {
        // Arrange
        var request = new CompileBotBehaviourRequest(BotBehaviourId: Guid.NewGuid().ToString(), BotBehaviourScript: "valid script");

        var compileResult = new CompileResult { Success = true, CompiledAssembly = [] };
        var blobUri = "https://example.com/blob/test-id";
        _behaviourCompilerMock
            .Setup(b => b.CompileScriptAsync(request.BotBehaviourScript, It.IsAny<CancellationToken>()))
            .ReturnsAsync(compileResult);
        _storageServiceMock
            .Setup(s => s.SaveCompiledBehaviorAsync(request.BotBehaviourId, compileResult.CompiledAssembly))
            .ReturnsAsync(blobUri);

        // Act
        var result = await _controller.Compile(request, CancellationToken.None);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = okResult.Value as CompileResponse;

        Assert.NotNull(response);
        Assert.Equal("Script compiled and saved successfully.", response.Message);
        Assert.Equal(blobUri, response.BlobUri);
        _publisherServiceMock.Verify(p => p.PublishBotBehaviorUpdate(It.Is<BotBehaviorUpdateMessage>(m =>
            m.BehaviorId == request.BotBehaviourId && m.BlobUri == blobUri)), Times.Once);
    }
}