using airo_auth_microservice.Controllers;
using airo_auth_microservice.DTOs;
using airo_auth_microservice.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace airo_auth_tests;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly Mock<IRabbitMQPublisherService> _rabbitMQPublisherMock;
    private readonly Mock<ILogger<AuthController>> _loggerMock;

    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _rabbitMQPublisherMock = new Mock<IRabbitMQPublisherService>();
        _loggerMock = new Mock<ILogger<AuthController>>();
        _controller = new AuthController(_authServiceMock.Object, _rabbitMQPublisherMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Signup_Success_ReturnsOkAndPublishesEvent()
    {
        // Arrange
        var signupRequest = new SignupRequest("test@example.com", "password");
        var signupResponse = new SignupResponse("user_id", "mock_token");

        _authServiceMock
            .Setup(service => service.SignUp(signupRequest.Email, signupRequest.Password))
            .ReturnsAsync(signupResponse);

        // Act
        var result = await _controller.Signup(signupRequest) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
        Assert.Equal(signupResponse, result.Value);

        _rabbitMQPublisherMock.Verify(publisher => publisher.PublishUserCreatedEvent(It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task Signup_Failure_ReturnsUnauthorized()
    {
        // Arrange
        var signupRequest = new SignupRequest("test@example.com", "password");

        _authServiceMock
            .Setup(service => service.SignUp(signupRequest.Email, signupRequest.Password))
            .ReturnsAsync((SignupResponse)null); // Signup failed

        // Act
        var result = await _controller.Signup(signupRequest) as UnauthorizedResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(401, result.StatusCode);

        _rabbitMQPublisherMock.Verify(publisher => publisher.PublishUserCreatedEvent(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Login_Success_ReturnsOk()
    {
        // Arrange
        var loginRequest = new LoginRequest("test@example.com", "password");
        var loginResponse = new LoginResponse("user_id", "mock_token");

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
            .ReturnsAsync((LoginResponse)null); // Login failed

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

    [Fact]
    public async Task GetUserRole_Found_ReturnsOk()
    {
        // Arrange
        var email = "test@example.com";
        var role = "Admin";

        _authServiceMock
            .Setup(service => service.GetUserRole(email))
            .ReturnsAsync(role);

        // Act
        var result = await _controller.GetUserRole(email) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
        Assert.Equal(new GetUserRoleResponse(role), (result.Value as GetUserRoleResponse));
    }

    [Fact]
    public async Task GetUserRole_NotFound_ReturnsNotFound()
    {
        // Arrange
        var email = "test@example.com";

        _authServiceMock
            .Setup(service => service.GetUserRole(email))
            .ReturnsAsync((string)null); // Role not found

        // Act
        var result = await _controller.GetUserRole(email) as NotFoundResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(404, result.StatusCode);
    }
}

