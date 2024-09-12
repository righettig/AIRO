using airo_admin_auth_microservice.Models;
using airo_admin_auth_microservice.Services;
using Microsoft.AspNetCore.Mvc;

namespace airo_admin_auth_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService, ILogger<AuthController> logger) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await authService.Login(request.Email, request.Password);

        if (response is not null)
        {
            return Ok(response);
        }

        return Unauthorized();
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        authService.SignOut();

        return Ok();
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var newToken = await authService.RefreshToken();

        return Ok(new { token = newToken });
    }
}
