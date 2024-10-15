using airo_leaderboard_microservice.Common.Services.Impl;

namespace airo_leaderboard_microservice.Common.Services.Interfaces;

public interface IEventCompletedProcessor
{
    Task ProcessEventAsync(EventCompletedMessage message);
}
