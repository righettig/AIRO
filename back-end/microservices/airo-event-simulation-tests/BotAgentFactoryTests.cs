using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;
using System.Reflection;
using System.Reflection.Emit;

namespace airo_event_simulation_tests;

public class BotAgentFactoryTests
{
    private readonly BotAgentFactory _factory;

    public BotAgentFactoryTests()
    {
        _factory = new BotAgentFactory();
    }

    [Fact]
    public void Create_ShouldReturnBotAgent_WhenAssemblyContainsValidType_BaseBotAgent()
    {
        // Arrange
        var assembly = CreateDynamicAssembly("ValidBotAgent", typeof(BaseBotAgent), null);

        // Act
        var result = _factory.Create(assembly);

        // Assert
        Assert.NotNull(result);
    }

    [Fact]
    public void Create_ShouldReturnBotAgent_WhenAssemblyContainsValidType_IBotAgent()
    {
        // Arrange
        var assembly = CreateDynamicAssembly("ValidBotAgent", null, typeof(IBotAgent));

        // Act
        var result = _factory.Create(assembly);

        // Assert
        Assert.NotNull(result);
    }

    [Fact]
    public void Create_ShouldThrowException_WhenNoCompatibleTypeFound()
    {
        // Arrange
        var assembly = CreateAssemblyWithAgent_NonCompatibleType();

        // Act & Assert
        var exception = Assert.Throws<InvalidOperationException>(() => _factory.Create(assembly));
        Assert.Equal("No implementation of BaseBotAgent found in the script.", exception.Message);
    }

    [Fact]
    public void Create_ShouldThrowException_WhenCompatibleTypeHasNoParameterlessConstructor()
    {
        // Arrange
        var assembly = CreateDynamicAssembly("BotAgentWithNoParameterlessConstructor", typeof(BaseBotAgent), null, true);

        // Act & Assert
        var exception = Assert.Throws<InvalidOperationException>(() => _factory.Create(assembly));
        Assert.Equal("The class must have a parameterless constructor.", exception.Message);
    }

    #region Helper methods for testing

    private static Assembly CreateAssemblyWithAgent_NonCompatibleType()
    {
        return CreateDynamicAssembly("NonCompatibleType", typeof(object), null);
    }

    private static Assembly CreateDynamicAssembly(string typeName,
                                                  Type baseType,
                                                  Type interfaceType,
                                                  bool hasNoParameterlessConstructor = false)
    {
        var assemblyName = new AssemblyName("DynamicBotAgentAssembly");
        var assemblyBuilder = AssemblyBuilder.DefineDynamicAssembly(assemblyName, AssemblyBuilderAccess.Run);
        var moduleBuilder = assemblyBuilder.DefineDynamicModule("MainModule");

        // Define type based on parameters
        TypeBuilder typeBuilder = 
            moduleBuilder.DefineType(typeName,
                                     TypeAttributes.Public,
                                     baseType,
                                     interfaceType != null ? [interfaceType] : Type.EmptyTypes);

        // Add constructor based on whether the type should have a parameterless constructor or not
        if (!hasNoParameterlessConstructor)
        {
            typeBuilder.DefineDefaultConstructor(MethodAttributes.Public);
        }
        else
        {
            // Define constructor with a parameter
            ConstructorBuilder constructorBuilder = typeBuilder.DefineConstructor(
                MethodAttributes.Public,
                CallingConventions.Standard,
                [typeof(int)]);

            ILGenerator ctorIL = constructorBuilder.GetILGenerator();
            ctorIL.Emit(OpCodes.Ldarg_0);
            ctorIL.Emit(OpCodes.Ret);
        }

        // Define method ComputeNextMove
        MethodBuilder methodBuilder = typeBuilder.DefineMethod(
            "ComputeNextMove",
            MethodAttributes.Public | MethodAttributes.Virtual,
            typeof(ISimulationAction),
            [typeof(IBotState)]);

        ILGenerator ilGenerator = methodBuilder.GetILGenerator();
        ilGenerator.ThrowException(typeof(NotImplementedException));

        // Create and return the type
        typeBuilder.CreateType();
        return assemblyBuilder;
    }

    #endregion
}
