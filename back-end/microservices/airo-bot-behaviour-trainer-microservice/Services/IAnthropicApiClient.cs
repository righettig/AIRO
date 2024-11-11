
namespace airo_bot_behaviour_trainer_microservice.Services
{
    public interface IAnthropicApiClient
    {
        Task<string> GenerateBotBehaviorAsync();
    }
}