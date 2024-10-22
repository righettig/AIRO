using airo_admin_auth_microservice.Controllers;
using airo_admin_auth_microservice.DTOs;
using airo_admin_auth_microservice.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace airo_admin_auth_tests;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly Mock<ILogger<AuthController>> _loggerMock;

    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _loggerMock = new Mock<ILogger<AuthController>>();
        _controller = new AuthController(_authServiceMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Login_Success_ReturnsOk()
    {
        // Arrange
        var loginRequest = new LoginRequest("test@example.com", "password");
        var loginResponse = new LoginResponse("Uid", "mock_token");

        _authServiceMock
            .Setup(service => service.Login(loginRequest.Email, loginRequest.Password))
            .ReturnsAsync(loginResponse);

        // Act
        var result = await _controller.Login(loginRequest) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
        Assert.Equal(loginResponse, result.Value);
    }

    [Fact]
    public async Task Login_Failure_ReturnsUnauthorized()
    {
        // Arrange
        var loginRequest = new LoginRequest("test@example.com", "wrong_password");

        _authServiceMock
            .Setup(service => service.Login(loginRequest.Email, loginRequest.Password))
            .ReturnsAsync((LoginResponse)null); // No token returned

        // Act
        var result = await _controller.Login(loginRequest) as UnauthorizedResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(401, result.StatusCode);
    }

    [Fact]
    public void Logout_ReturnsOk()
    {
        // Act
        var result = _controller.Logout() as OkResult;

        // Assert
        _authServiceMock.Verify(service => service.SignOut(), Times.Once);
        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
    }

    [Fact]
    public async Task RefreshToken_ReturnsNewToken()
    {
        // Arrange
        var newToken = "new_mock_token";

        _authServiceMock
            .Setup(service => service.RefreshToken())
            .ReturnsAsync(newToken);

        // Act
        var result = await _controller.RefreshToken() as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
        Assert.Equal(new RefreshTokenResponse(newToken), (result.Value as RefreshTokenResponse));
    }
}