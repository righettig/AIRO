using airo_event_simulation_microservice.Services.Impl;

namespace airo_event_simulation_microservice.Services.Interfaces;

public interface IBotBehaviourCacheUpdater
{
    Task UpdateBotBehaviorAsync(BotBehaviorMessage message);
}