using anybotics_anymal.CommandProcessors;
using System.Reflection;

namespace anybotics_anymal;

public static class CommandProcessorDiscovery
{
    public static Dictionary<string, ICommandProcessor> DiscoverCommandProcessors()
    {
        var processors = new Dictionary<string, ICommandProcessor>();

        // Get the assembly where the CommandProcessors are located
        var assembly = Assembly.GetExecutingAssembly();

        // Find all types in the assembly that implement ICommandProcessor
        var commandProcessorTypes = assembly.GetTypes()
            .Where(type => typeof(ICommandProcessor).IsAssignableFrom(type) && !type.IsAbstract);

        try
        {
            foreach (var type in commandProcessorTypes)
            {
                // Create an instance of the command processor
                var processor = (ICommandProcessor)Activator.CreateInstance(type);

                // Add to the dictionary with the CommandId as the key
                processors.Add(processor.CommandId, processor);
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("Error registering command processor: " + e);
            throw;
        }


        return processors;
    }
}