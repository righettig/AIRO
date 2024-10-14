using airo_leaderboard_microservice.Behaviours;
using airo_leaderboard_microservice.Common.Models;
using airo_leaderboard_microservice.Common.Services.Interfaces;
using airo_leaderboard_microservice.Users;

namespace airo_leaderboard_microservice.Common.Services.Impl;

public class EventCompletedProcessor(ILeaderboardWriteService<UserLeaderboardEntry> userLeaderboardService,
                                     ILeaderboardWriteService<BehaviourLeaderboardEntry> behavioursLeaderboardService,
                                     IEventSubscriptionService eventSubscriptionService) : IEventCompletedProcessor
{
    public async Task ProcessEventAsync(EventCompletedMessage message)
    {
        var participants = await FetchParticipantsAsync(message.EventId);

        foreach (var participant in participants)
        {
            if (participant.UserId == message.WinnerUserId)
            {
                await userLeaderboardService.MarkAsWinner(participant.UserId);
                await behavioursLeaderboardService.MarkAsWinner(participant.BotBehaviourId.ToString());
            }
            else 
            {
                await userLeaderboardService.MarkAsLoser(participant.UserId);
                await behavioursLeaderboardService.MarkAsLoser(participant.BotBehaviourId.ToString());
            }
        }
    }

    private async Task<EventSubscriptionDto[]> FetchParticipantsAsync(Guid eventId)
    {
        return await eventSubscriptionService.GetParticipants(eventId);
    }
}