using airo_event_simulation_domain.Interfaces;
using System.Reflection;

namespace airo_event_simulation_domain.Impl.Simulation;

public class BotAgentFactory : IBotAgentFactory
{
    public IBotAgent Create(Assembly assembly)
    {
        // Now you can access types from the loaded assembly
        var agentType = assembly.GetTypes()
            .FirstOrDefault(t => typeof(BaseBotAgent).IsAssignableFrom(t) || typeof(IBotAgent).IsAssignableFrom(t));

        if (agentType == null)
        {
            throw new InvalidOperationException("No implementation of BaseBotAgent found in the script.");
        }

        // Ensure the class has a parameterless constructor
        var constructor = agentType.GetConstructor(Type.EmptyTypes);
        if (constructor == null)
        {
            throw new InvalidOperationException("The class must have a parameterless constructor.");
        }

        // Instantiate the agent
        var botAgent = (IBotAgent)Activator.CreateInstance(agentType);

        return botAgent;
    }
}
