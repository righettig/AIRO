using airo_leaderboard_microservice.Common.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace airo_leaderboard_microservice.Users;

[ApiController]
[Route("api/leaderboard/users")]
public class UsersLeaderboardController(ILeaderboardReadService<UserLeaderboardEntry> leaderboardService) : ControllerBase
{
    [HttpGet("top/{n}")]
    public async Task<IActionResult> GetTopUsers(int n)
    {
        var topUsers = await leaderboardService.GetTopNAsync(n);
        return Ok(topUsers);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserById(string userId)
    {
        var userEntry = await leaderboardService.GetByIdAsync(userId);
        return Ok(userEntry);
    }
}