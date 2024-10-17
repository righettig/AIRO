using airo_auth_microservice.DTOs;
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
        logger.LogInformation("Signup attempt for email: {Email}", request.Email);

        var response = await authService.SignUp(request.Email, request.Password);

        if (response is not null)
        {
            var userData = Newtonsoft.Json.JsonConvert.SerializeObject(request.Email);

            rabbitMQPublisherService.PublishUserCreatedEvent(userData);
            logger.LogInformation("User signup successful, event published for email: {Email}", request.Email);

            return Ok(response);
        }

        logger.LogWarning("Signup failed for email: {Email}", request.Email);
        return Unauthorized();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        logger.LogInformation("Login attempt for email: {Email}", request.Email);

        var response = await authService.Login(request.Email, request.Password);

        if (response is not null)
        {
            logger.LogInformation("Login successful for email: {Email} with token: {Token}", request.Email, response.Token);
            return Ok(response);
        }

        logger.LogWarning("Login failed for email: {Email}", request.Email);
        return Unauthorized();
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        authService.SignOut();
        logger.LogInformation("User logged out.");
        return Ok();
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        logger.LogInformation("Token refresh attempt.");

        var newToken = await authService.RefreshToken();

        logger.LogInformation("Token refreshed successfully.");

        return Ok(new RefreshTokenResponse(newToken));
    }

    [HttpGet("user-role")]
    public async Task<IActionResult> GetUserRole([FromQuery] string email)
    {
        logger.LogInformation("Retrieving user role for email: {Email}", email);

        var role = await authService.GetUserRole(email);

        if (role != null)
        {
            logger.LogInformation("User role found for email: {Email}", email);
            return Ok(new GetUserRoleResponse(role));
        }

        logger.LogWarning("User role not found for email: {Email}", email);
        return NotFound();
    }
}
