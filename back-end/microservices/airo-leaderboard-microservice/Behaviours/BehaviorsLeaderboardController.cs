using airo_leaderboard_microservice.Common.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace airo_leaderboard_microservice.Behaviours;

[ApiController]
[Route("api/leaderboard/behaviors")]
public class BehaviorsLeaderboardController(ILeaderboardReadService<BehaviourLeaderboardEntry> leaderboardService) : ControllerBase
{
    [HttpGet("top/{n}")]
    public async Task<IActionResult> GetTopBehaviors(int n)
    {
        var topBehaviors = await leaderboardService.GetTopNAsync(n);
        return Ok(topBehaviors);
    }

    [HttpGet("{behaviorId}")]
    public async Task<IActionResult> GetBehaviorById(Guid behaviorId)
    {
        var behaviorEntry = await leaderboardService.GetByIdAsync(behaviorId.ToString());
        return Ok(behaviorEntry);
    }
}