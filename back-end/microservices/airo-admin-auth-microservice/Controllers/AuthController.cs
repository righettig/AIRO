using airo_admin_auth_microservice.DTOs;
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
        logger.LogInformation("Logout attempt.");
        
        authService.SignOut();

        logger.LogInformation("User logged out.");
        
        return Ok();
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        logger.LogInformation("Token refresh attempt.");

        var newToken = await authService.RefreshToken();

        logger.LogInformation("Token refreshed: {Token}", newToken);
        
        return Ok(new RefreshTokenResponse(newToken));
    }
}
