using airo_bot_behaviour_compiler_microservice.Impl;

namespace airo_bot_behaviour_compiler_microservice.Interfaces;

public interface IRabbitMQPublisherService : IDisposable
{
    void PublishBotBehaviorUpdate(BotBehaviorUpdateMessage message);
}
