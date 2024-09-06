using airo_auth_microservice.Services;
using Microsoft.AspNetCore.Mvc;

namespace airo_auth_microservice.Controllers;

public record LoginRequest(string Email, string Password);

[ApiController]
[Route("api/[controller]")]
public class AuthController(IFirebaseAuthService firebaseAuthService,
                            ILogger<AuthController> logger) : ControllerBase
{
    [HttpPost("signup")]
    public async Task<IActionResult> Signup(string email, string password)
    {
        var token = await firebaseAuthService.SignUp(email, password);

        if (token is not null)
        {
            return Ok(token);
        }

        return Unauthorized();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await firebaseAuthService.Login(request.Email, request.Password);

        if (token is not null)
        {
            return Ok(new { token });
        }

        return Unauthorized();
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        firebaseAuthService.SignOut();

        return Ok();
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var newToken = await firebaseAuthService.RefreshToken();

        return Ok(new { token = newToken });
    }

    [HttpGet("user-role")]
    public async Task<IActionResult> GetUserRole([FromQuery] string email)
    {
        var role = await firebaseAuthService.GetUserRole(email);

        if (role != null)
        {
            return Ok(new { role });
        }

        return NotFound();
    }
}
