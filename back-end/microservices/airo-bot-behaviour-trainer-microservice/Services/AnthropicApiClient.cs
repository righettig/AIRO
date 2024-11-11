using System.Text;
using System.Text.Json;

namespace airo_bot_behaviour_trainer_microservice.Services;

public class AnthropicResponse
{
    public string Id { get; set; }
    public string Model { get; set; }
    public string Role { get; set; }
    public string Content { get; set; }
}

public class AnthropicApiClient : IAnthropicApiClient
{
    private readonly HttpClient _httpClient;

    private const string API_URL = "https://api.anthropic.com/v1/messages";

    public AnthropicApiClient(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.Add("x-api-key", configuration["ANTHROPIC_API_KEY"]);
        _httpClient.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");
    }

    public async Task<string> GenerateBotBehaviorAsync()
    {
        var promptContent = @"Generate C# code for an intelligent bot agent class that extends BaseBotAgent and overrides the ComputeNextMove method. The bot should make smarter decisions than a simple random movement bot. Include the following features:

1. State tracking to remember previous actions and detect when the bot is stuck
2. Action planning capability to queue up sequences of moves
3. Intelligent decision making using a weighted evaluation system for possible actions
4. Built-in recovery mechanisms for when the bot gets stuck
5. A balance between consistent behavior and unpredictability

The bot should have access to these movement actions:
- Hold()
- Up()
- Down()
- Left()
- Right()

Required class structure:
```csharp
using airo_event_simulation_domain.Impl.Simulation;
using airo_event_simulation_domain.Interfaces;

public class SmartBotAgent : BaseBotAgent
{
    public override ISimulationAction ComputeNextMove(IBotState botState)
    {
        // Your implementation here
    }
}
```

The implementation should:
- Use object-oriented principles
- Include clear comments explaining the logic
- Have methods for evaluating possible moves
- Include mechanisms for planning action sequences
- Handle edge cases and recovery scenarios
- Use a combination of deterministic and random factors in decision making

Make the code production-ready with error handling and clean architecture. The bot's behavior should be sophisticated but understandable. Make sure to return only the source code.";

        var request = new
        {
            //model = "claude-3-sonnet-20240229",
            //max_tokens = 4000,

            model = "claude-3-haiku-20240307",
            max_tokens = 2000,
            temperature = 0,

            messages = new[]
            {
                new
                {
                    role = "user",
                    content = promptContent
                }
            }
        };

        var jsonContent = JsonSerializer.Serialize(request);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync(API_URL, content);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();

            Console.WriteLine(responseBody);

            var responseObject = JsonSerializer.Deserialize<AnthropicResponse>(responseBody);

            return responseObject?.Content ?? "No content received";
        }
        catch (HttpRequestException ex)
        {
            throw new Exception($"Error calling Anthropic API: {ex.Message}", ex);
        }
    }
}
