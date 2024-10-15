using airo_leaderboard_microservice.Common.Models;

namespace airo_leaderboard_microservice.Common.Services.Interfaces;

public interface IEventSubscriptionService
{
    Task<EventSubscriptionDto[]> GetParticipants(Guid eventId);
}
