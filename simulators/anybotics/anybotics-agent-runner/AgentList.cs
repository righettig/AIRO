using System.Text.Json.Serialization;

namespace anybotics_agent_runner;

public class AgentList
{
    [JsonPropertyName("agents")]
    public required List<Agent> Agents { get; set; }
}
