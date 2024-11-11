using System.Reflection;
using System.Text.Json;

namespace airo_bot_behaviour_trainer_microservice.Services;

public class OpenAIService(HttpClient httpClient, IConfiguration configuration) : IOpenAIService
{
    private readonly string _apiKey = configuration["OPEN_AI_API_KEY"];

    public async Task<string> GetChatGptResponse(string prompt)
    {
        var requestContent = new
        {
            //model = "gpt-4",
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            temperature = 0.7
        };

        httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

        var response = await httpClient.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", requestContent);
        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(jsonResponse);
        var message = doc.RootElement
                        .GetProperty("choices")[0]
                        .GetProperty("message")
                        .GetProperty("content")
                        .GetString();

        return message;
    }
}