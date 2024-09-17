using System.Text.Json.Serialization;

namespace anybotics_agent_runner;

public class Agent
{
    [JsonPropertyName("name")]
    public required string Name { get; set; }
}
