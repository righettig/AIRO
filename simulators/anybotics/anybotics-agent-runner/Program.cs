using System.Diagnostics;
using System.Text.Json;

namespace anybotics_agent_runner;

class Program
{
    static async Task Main(string[] args)
    {
        if (args.Length == 0)
        {
            Console.WriteLine("Please provide a path to the JSON file containing agent names.");
            return;
        }

        string jsonFilePath = args[0];

        AgentList agents = null;
        try
        {
            // Read and deserialize the JSON file
            var jsonString = await File.ReadAllTextAsync(jsonFilePath);
            agents = JsonSerializer.Deserialize<AgentList>(jsonString);

            if (agents?.Agents == null || !agents.Agents.Any())
            {
                Console.WriteLine("No agents found in the provided JSON file.");
                return;
            }
        }
        catch (JsonException jsonEx)
        {
            Console.WriteLine($"JSON deserialization error: {jsonEx.Message}");
            return;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
            return;
        }

        // Launch each agent asynchronously
        var tasks = agents.Agents.Select(agent => Task.Run(() => RunAgent(agent))).ToList();

        // Wait for all tasks to complete
        await Task.WhenAll(tasks);
    }

    static void RunAgent(Agent agent)
    {
        string command = "dotnet";
        string arguments = $"run --project anybotics-anymal/anybotics-anymal.csproj -- \"{agent.Name}\"";

        Console.WriteLine($"Starting agent: {agent.Name}");

        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = command,
                Arguments = arguments,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        process.OutputDataReceived += (sender, e) => Console.WriteLine(e.Data);
        process.ErrorDataReceived += (sender, e) => Console.WriteLine(e.Data);

        process.Start();
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();

        process.WaitForExit();

        Console.WriteLine($"{agent.Name} has finished running.");
    }
}
