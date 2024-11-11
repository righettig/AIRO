namespace airo_event_simulation_tests;

public class CSharpBehaviourCompilerTests
{
    [Fact]
    public async Task Compile_ValidScript_ShouldReturnBotAgent()
    {
        // Arrange
        var compiler = new CSharpBehaviourCompiler();
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
        var botAgent = await compiler.Compile(validScript, cancellationToken);

        // Assert
        Assert.NotNull(botAgent);
    }

    [Fact]
    public async Task Compile_ShouldThrowException_When_Compilation_Timeout()
    {
        // Arrange
        var compiler = new CSharpBehaviourCompiler();
        var invalidScript = "while (true) {}";
        var cancellationToken = CancellationToken.None;

        // Act & Assert
        await Assert.ThrowsAsync<TimeoutException>(() => compiler.Compile(invalidScript, cancellationToken));
    }

    [Fact]
    public async Task Compile_InvalidScript_ShouldThrowException()
    {
        // Arrange
        var compiler = new CSharpBehaviourCompiler();
        var invalidScript = "invalid code";
        var cancellationToken = CancellationToken.None;

        // Act & Assert
        await Assert.ThrowsAsync<CompilationErrorException>(() => compiler.Compile(invalidScript, cancellationToken));
    }

    [Fact]
    public async Task Compile_ScriptWithoutBaseBotAgent_ShouldThrowException()
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
        await Assert.ThrowsAsync<InvalidOperationException>(() => compiler.Compile(scriptWithoutBaseBotAgent, cancellationToken));
    }

    [Fact]
    public async Task Compile_ScriptWithoutParameterlessConstructor_ShouldThrowException()
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
        await Assert.ThrowsAsync<InvalidOperationException>(() => compiler.Compile(scriptWithoutParameterlessConstructor, cancellationToken));
    }
}
