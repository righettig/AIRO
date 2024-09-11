using airo_auth_microservice.Models;
using airo_auth_microservice.Services;
using Microsoft.AspNetCore.Mvc;

namespace airo_auth_microservice.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService,
                            IRabbitMQPublisherService rabbitMQPublisherService,
                            ILogger<AuthController> logger) : ControllerBase
{   
    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request)
    {
        var response = await authService.SignUp(request.Email, request.Password);

        if (response is not null)
        {
            var userData = Newtonsoft.Json.JsonConvert.SerializeObject(request.Email);

            rabbitMQPublisherService.PublishUserCreatedEvent(userData);

            return Ok(response);
        }

        return Unauthorized();
    }

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

    // TODO: email should be extracted from token
    [HttpGet("user-role")]
    public async Task<IActionResult> GetUserRole([FromQuery] string email)
    {
        var role = await authService.GetUserRole(email);

        if (role != null)
        {
            return Ok(new { role });
        }

        return NotFound();
    }
}
