using airo_bot_behaviour_compiler_microservice.Impl;
using airo_bot_behaviour_compiler_microservice.Interfaces;
using Microsoft.CodeAnalysis.Scripting;

namespace airo_bot_behaviour_compiler_tests;

public class CSharpBehaviourCompilerTests
{
    private readonly CSharpBehaviourCompiler compiler;

    public CSharpBehaviourCompilerTests()
    {
        compiler = new CSharpBehaviourCompiler();
    }

    #region ValidateScriptAsync

    [Fact]
    public async Task ValidateScriptAsync_ShouldReturnSuccess_WhenScriptContainsValidBotAgent()
    {
        // Arrange
        var validScript = @"
            using airo_event_simulation_domain.Interfaces;
            public class MyBotAgent : BaseBotAgent
            {
                public MyBotAgent() {}
                public override ISimulationAction ComputeNextMove(IBotState state) => new HoldAction();
            }";

        var cancellationToken = new CancellationToken();

        // Act
        var result = await compiler.ValidateScriptAsync(validScript, cancellationToken);

        // Assert
        Assert.True(result.Success);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public async Task ValidateScriptAsync_ShouldReturnErrors_WhenScriptContainsSyntaxErrors()
    {
        // Arrange
        var invalidScript = "public class {";
        var cancellationToken = new CancellationToken();

        // Act
        var result = await compiler.ValidateScriptAsync(invalidScript, cancellationToken);

        // Assert
        Assert.False(result.Success);
        Assert.NotEmpty(result.Errors);
        Assert.Equal(["(1,14): error CS1001: Identifier expected", "(1,15): error CS1513: } expected"], result.Errors);
    }

    [Fact]
    public async Task ValidateScriptAsync_ShouldReturnError_WhenScriptIsMissingBotAgent()
    {
        // Arrange
        var noBotAgentScript = "public class SomeOtherClass { }";
        var cancellationToken = new CancellationToken();

        // Act
        var result = await compiler.ValidateScriptAsync(noBotAgentScript, cancellationToken);

        // Assert
        Assert.False(result.Success);
        Assert.Contains("No implementation of BaseBotAgent or IBotAgent found in the script.", result.Errors);
    }

    [Fact]
    public async Task ValidateScriptAsync_ShouldReturnError_WhenBotAgentIsMissingParameterlessConstructor()
    {
        // Arrange
        var missingConstructorScript = @"
            using airo_event_simulation_domain.Interfaces;
            public class MyBotAgent : BaseBotAgent
            {
                public MyBotAgent(int someParam) {}
                public override ISimulationAction ComputeNextMove(IBotState state) => new HoldAction();
            }";

        var cancellationToken = new CancellationToken();

        // Act
        var result = await compiler.ValidateScriptAsync(missingConstructorScript, cancellationToken);

        // Assert
        Assert.False(result.Success);
        Assert.Contains("The class must have a parameterless constructor.", result.Errors);
    }

    [Fact]
    public async Task ValidateScriptAsync_ShouldReturnErrors_WhenCompilationTakesTooLong()
    {
        // Arrange
        var longRunningScript = "while (true) {}";

        // Act & Assert
        var actual = await compiler.ValidateScriptAsync(longRunningScript, CancellationToken.None);

        Assert.IsType<ValidationResult>(actual);
        Assert.False(actual.Success);
        Assert.Equal(["Validation failed: Behavior compilation timed out."], actual.Errors);
    }

    #endregion

    #region CompileScriptAsync

    [Fact]
    public async Task CompileScriptAsync_ValidScript_ShouldReturnBotAgent()
    {
        // Arrange
        var validScript = @"
                using airo_event_simulation_domain.Impl;
                using airo_event_simulation_domain.Interfaces;

                public class DummyBotAgent : BaseBotAgent
                {
                    public override ISimulationAction ComputeNextMove(IBotState botState)
                    {
                        return new HoldAction();
                    }
                }
            ";
        var cancellationToken = CancellationToken.None;

        // Act
        var botAgent = await compiler.CompileScriptAsync(validScript, cancellationToken);

        // Assert
        Assert.NotNull(botAgent);
    }

    [Fact]
    public async Task CompileScriptAsync_ShouldThrowException_When_Compilation_Timeout()
    {
        // Arrange
        var compiler = new CSharpBehaviourCompiler();
        var invalidScript = "while (true) {}";
        var cancellationToken = CancellationToken.None;

        // Act & Assert
        await Assert.ThrowsAsync<TimeoutException>(() => compiler.CompileScriptAsync(invalidScript, cancellationToken));
    }

    [Fact]
    public async Task CompileScriptAsync_InvalidScript_ShouldThrowException()
    {
        // Arrange
        var compiler = new CSharpBehaviourCompiler();
        var invalidScript = "invalid code";
        var cancellationToken = CancellationToken.None;

        // Act & Assert
        await Assert.ThrowsAsync<CompilationErrorException>(() => compiler.CompileScriptAsync(invalidScript, cancellationToken));
    }

    [Fact]
    public async Task CompileScriptAsync_ScriptWithoutBaseBotAgent_ShouldReturnError()
    {
        // Arrange
        var compiler = new CSharpBehaviourCompiler();
        var scriptWithoutBaseBotAgent = @"
                public class SomeRandomClass
                {
                }
            ";
        var cancellationToken = CancellationToken.None;

        // Act & Assert
        var actual = await compiler.CompileScriptAsync(scriptWithoutBaseBotAgent, cancellationToken);

        Assert.IsType<CompileResult>(actual);
        Assert.False(actual.Success);
        Assert.Equal(["No implementation of BaseBotAgent or IBotAgent found in the script."], actual.Errors);
    }

    [Fact]
    public async Task CompileScriptAsync_ScriptWithoutParameterlessConstructor_ShouldReturnError()
    {
        // Arrange
        var compiler = new CSharpBehaviourCompiler();
        var scriptWithoutParameterlessConstructor = @"
                using airo_event_simulation_domain.Impl;
                using airo_event_simulation_domain.Interfaces;

                public class DummyBotAgent : BaseBotAgent
                {
                    public DummyBotAgent(string someParameter)
                    {
                    }

                    public override ISimulationAction ComputeNextMove(IBotState botState)
                    {
                        return new HoldAction();
                    }
                }
            ";
        var cancellationToken = CancellationToken.None;

        // Act & Assert
        var actual = await compiler.CompileScriptAsync(scriptWithoutParameterlessConstructor, cancellationToken);

        Assert.IsType<CompileResult>(actual);
        Assert.False(actual.Success);
        Assert.Equal(["The class must have a parameterless constructor."], actual.Errors);
    }

    #endregion
}
