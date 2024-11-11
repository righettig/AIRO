
namespace airo_bot_behaviour_trainer_microservice.Services
{
    public interface IOpenAIService
    {
        Task<string> GetChatGptResponse(string prompt);
    }
}